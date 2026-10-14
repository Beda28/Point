import { Injectable }       from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';

import { User }        from '../database/entities/user.entity.js';
import { Product }     from '../database/entities/product.entity.js';
import { Wallet }      from '../database/entities/wallet.entity.js';
import { Transaction } from '../database/entities/transaction.entity.js';

@Injectable()
export class CommerceRepository {
  constructor(
    @InjectRepository(User)
    private readonly users       : Repository<User>,

    @InjectRepository(Product)
    private readonly products    : Repository<Product>,

    @InjectRepository(Wallet)
    private readonly wallets     : Repository<Wallet>,

    @InjectRepository(Transaction)
    private readonly transactions: Repository<Transaction>
  ) {}

  async findUser(uuid: string): Promise<User | null> {
    return this.users.findOneBy({ uuid });
  }

  async findProduct(pid: string): Promise<Product | null> {
    return this.products.findOneBy({ pid });
  }

  async findWallet(uid: string): Promise<Wallet | null> {
    return this.wallets.findOneBy({ uid });
  }

  async findTransaction(tid: string): Promise<Transaction | null> {
    return this.transactions.findOneBy({ tid });
  }
}
