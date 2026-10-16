import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService }                        from '@nestjs/jwt';
import { randomUUID }                        from 'node:crypto';
import { compare, hash }                     from 'bcryptjs';
import { AuthRepository }                    from './auth.repository.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService    : JwtService,
  ) {}

  async login(id: string, pw: string) {
    const user = await this.authRepository.findUser({ id })
    if (!user || !await compare(pw, user.pw_hash)) throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다')

    return { access_token: await this.jwtService.signAsync({ sub: user.uuid }) }
  }

  async register(id: string, pw: string) {
    const uuid    = randomUUID()
    const pw_hash = await hash(pw, 10)

    await this.authRepository.register(uuid, id, pw_hash)
    return { access_token: await this.jwtService.signAsync({ sub: uuid }) }
  }
}
