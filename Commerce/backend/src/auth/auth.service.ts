import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  async me(uuid: string) {
    const user = await this.authRepository.findUser({ uuid })
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다')
    return { uuid: user.uuid, id: user.id }
  }

  async changePassword(uuid: string, pw: string, newPw: string) {
    if (typeof pw !== 'string' || typeof newPw !== 'string' || !newPw) {
      throw new BadRequestException('기존 비밀번호와 새 비밀번호를 입력해주세요')
    }
    const user = await this.authRepository.findUser({ uuid })
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다')
    if (!await compare(pw, user.pw_hash)) throw new BadRequestException('기존 비밀번호가 올바르지 않습니다')

    await this.authRepository.updatePassword(uuid, await hash(newPw, 10))
    return { message: '비밀번호가 변경되었습니다' }
  }

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
