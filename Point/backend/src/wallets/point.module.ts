import { Module }          from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';
import { AuthModule }      from '../auth/auth.module.js';
import { RequestRecord }   from '../database/entities/record.entity.js';
import { Transaction }     from '../database/entities/transaction.entity.js';
import { Wallet }          from '../database/entities/wallet.entity.js';
import { PointController } from './point.controller.js';
import { PointRepository } from './point.repository.js';
import { PointService }    from './point.service.js';

@Module({
  imports    : [AuthModule, TypeOrmModule.forFeature([Wallet, Transaction, RequestRecord])],
  controllers: [PointController],
  providers  : [PointService, PointRepository],
})
export class PointModule {}
