import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule }            from '../auth/auth.module.js';
import { Product }               from '../database/entities/product.entity.js';
import { Transaction }           from '../database/entities/transaction.entity.js';
import { PointClient }           from '../point/point.client.js';
import { TransactionController } from './transaction.controller.js';
import { TransactionRepository } from './transaction.repository.js';
import { TransactionService }    from './transaction.service.js';

@Module({
    imports    : [AuthModule, TypeOrmModule.forFeature([Transaction, Product])],
    controllers: [TransactionController],
    providers  : [TransactionService, TransactionRepository, PointClient],
})
export class TransactionModule {}
