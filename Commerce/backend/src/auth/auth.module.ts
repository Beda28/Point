import { Module }         from '@nestjs/common';
import { JwtModule }      from '@nestjs/jwt';
import { TypeOrmModule }  from '@nestjs/typeorm';
import { User }           from '../database/entities/user.entity.js';
import { JwtGuard }       from '../guard/jwt.guard.js';
import { PointClient }    from '../point/point.client.js';
import { AuthController } from './auth.controller.js';
import { AuthRepository } from './auth.repository.js';
import { AuthService }    from './auth.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret     : process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers  : [AuthService, AuthRepository, JwtGuard, PointClient],
  exports    : [JwtGuard, JwtModule],
})
export class AuthModule {}
