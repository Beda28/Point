import { Injectable, UnauthorizedException }  from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type ClientRequest = Request & { client_id: string; };

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ClientRequest>();

    const apiKey   = request.headers['x-api-key'];
    const validKey = process.env.API_KEY;
    const clientId = process.env.API_CLIENT_ID;

    if (!validKey || !clientId)           throw new UnauthorizedException('API authentication unavailable');
    if (!apiKey   || apiKey !== validKey) throw new UnauthorizedException('Invalid API key');

    request.client_id = clientId;

    return true;
  }
}