import { BadRequestException, ForbiddenException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService }                        from '@nestjs/jwt';
import { randomUUID }                        from 'node:crypto';
import { compare, hash }                     from 'bcryptjs';
import { PointApiError, PointClient }         from '../point/point.client.js';
import { AuthRepository }                    from './auth.repository.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService    : JwtService,
    private readonly pointClient   : PointClient,
  ) {}

  private async findWallet(uuid: string) {
    try {
      return await this.pointClient.findWallet(uuid)
    } catch {
      throw new ServiceUnavailableException('계좌 연결에 실패했습니다. 잠시 후 다시 로그인해주세요.')
    }
  }

  async me(uuid: string) {
    const user = await this.authRepository.findUser({ uuid })
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다')
    const wallet = await this.findWallet(uuid)
    return {
      uuid: user.uuid, id: user.id,
      balance: wallet.balance, point: wallet.point, status: wallet.status,
      can_charge: process.env.TEST_CHARGE_ENABLED === 'true',
    }
  }

  async charge(uuid: string, amount: number, reqKey: string) {
    if (process.env.TEST_CHARGE_ENABLED !== 'true') throw new ForbiddenException('테스트 충전이 비활성화되어 있습니다')
    await this.me(uuid)
    try {
      return await this.pointClient.request('/wallets/earn', 'POST', {
        user_id: uuid, amount, ref_id: `charge:${reqKey}`,
      }, `charge:${uuid}:${reqKey}`)
    } catch (error) {
      if (error instanceof PointApiError && error.status === 400) throw new BadRequestException('충전할 수 없는 계좌입니다')
      throw new ServiceUnavailableException('충전 결과를 확인하지 못했습니다. 같은 요청으로 다시 시도해주세요.')
    }
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

    await this.findWallet(user.uuid)
    return { access_token: await this.jwtService.signAsync({ sub: user.uuid }) }
  }

  async register(id: string, pw: string) {
    const uuid    = randomUUID()
    const pw_hash = await hash(pw, 10)

    await this.authRepository.register(uuid, id, pw_hash)
    await this.findWallet(uuid)
    return { access_token: await this.jwtService.signAsync({ sub: uuid }) }
  }
}
