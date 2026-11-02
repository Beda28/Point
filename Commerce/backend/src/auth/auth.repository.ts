import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository }              from '@nestjs/typeorm';
import { QueryFailedError, Repository }  from 'typeorm';
import { User }                          from '../database/entities/user.entity.js';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async findUser(target: { uuid: string } | { id: string }): Promise<User | null> {
    return this.users.findOneBy(target)
  }

  async register(uuid: string, id: string, pw_hash: string) {
    const user = await this.findUser({ id })
    if (user) throw new ConflictException('이미 사용 중인 아이디입니다')

    try {
      return await this.users.insert({ uuid, id, pw_hash })
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError.code === 'ER_DUP_ENTRY')
        throw new ConflictException('이미 사용 중인 아이디입니다')
      throw error
    }
  }

  async updatePassword(uuid: string, pw_hash: string) {
    return this.users.update({ uuid }, { pw_hash })
  }
}
