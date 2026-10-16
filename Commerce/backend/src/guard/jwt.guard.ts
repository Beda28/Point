import { Injectable, UnauthorizedException }  from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService }                        from '@nestjs/jwt';
import type { Request }                      from 'express';

export type UserRequest = Request & { userId: string };

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const token   = request.get('Authorization')?.match(/^Bearer (\S+)$/i)?.[1];

    if (!token) throw new UnauthorizedException('인증 토큰이 필요합니다');

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      if (typeof payload.sub !== 'string' || !payload.sub) {
        throw new UnauthorizedException('사용자 정보가 없는 토큰입니다');
      }
      request.userId = payload.sub;
    } catch {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다');
    }

    return true;
  }
}
