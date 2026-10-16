import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard }         from '../guard/jwt.guard.js';
import type { UserRequest } from '../guard/jwt.guard.js';
import { AuthService }      from './auth.service.js';
import { AuthDto }          from './dto/auth.dto.js';
import { PasswordDto }      from './dto/password.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/me')
  @UseGuards(JwtGuard)
  me(@Req() req: UserRequest) {
    return this.authService.me(req.userId)
  }

  @Patch('/password')
  @UseGuards(JwtGuard)
  changePassword(@Req() req: UserRequest, @Body() body: PasswordDto) {
    return this.authService.changePassword(req.userId, body.pw, body.new_pw)
  }

  @Post('/login')
  login(
    @Body() body: AuthDto
  ) {
    return this.authService.login(body.id, body.pw)
  }

  @Post('/register')
  register(
    @Body() body: AuthDto
  ) {
    return this.authService.register(body.id, body.pw)
  }
}
