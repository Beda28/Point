import { Body, Controller, Post }  from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthDto } from './dto/auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
