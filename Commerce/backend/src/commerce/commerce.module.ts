import { Module }             from '@nestjs/common';
import { TypeOrmModule }       from '@nestjs/typeorm';
import { User }                from '../database/entities/user.entity.js';
import { Product }             from '../database/entities/product.entity.js';
import { Wallet }              from '../database/entities/wallet.entity.js';
import { Transaction }         from '../database/entities/transaction.entity.js';
import { CommerceRepository }  from './commerce.repository.js';

@Module({
  imports  : [TypeOrmModule.forFeature([User, Product, Wallet, Transaction])],
  providers: [CommerceRepository],
  exports  : [CommerceRepository],
})
export class CommerceModule {}
