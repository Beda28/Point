import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository }              from '@nestjs/typeorm';
import { EntityManager }                 from 'typeorm';
import { Repository }                    from 'typeorm';

import { Wallet }           from '../database/entities/wallet.entity.js';
import { Transaction }      from '../database/entities/transaction.entity.js';

@Injectable()
export class PointRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly wallets     : Repository<Wallet>,

    @InjectRepository(Transaction)
    private readonly transactions: Repository<Transaction>
  ) {}

  async findWallet(clientId: string, user_id: string, manager?: EntityManager): Promise<Wallet | null> {
    if (manager) return manager.findOne(Wallet, {
      where: { client_id: clientId, user_id: user_id },
      lock : { mode: 'pessimistic_write' }
    })

    return this.wallets.findOneBy({ client_id: clientId, user_id: user_id });
  }

  async initWallet(id: string, clientId: string, user_id: string): Promise<Wallet> {
    await this.wallets.insert({
      id, client_id: clientId, user_id,
      balance: '0',
      status : 'ACTIVE',
    });

    return this.wallets.findOneByOrFail({ id, client_id: clientId, user_id });
  }

  async deActiveWallet(clientId: string, userId: string) {
    await this.wallets.update(
      { client_id: clientId, user_id: userId },
      { status   : 'INACTIVE' }
    )
  }

  async getTransactions(wallet_id: string): Promise<Transaction[]> {
    return this.transactions.find({
      where: {wallet_id : wallet_id},
      order: {created_at: 'DESC', id: 'DESC'}
    })
  }

  async addTransactions(
    id    : string, wallet_id: string, type  : 'EARN' | 'SPEND', 
    amount: string, balance  : string, ref_id: string, manager: EntityManager
  ) {
    return manager.insert(Transaction, {
      id    , wallet_id, type, 
      amount, balance  , ref_id,
      original_id: null
    })
  }

  async updateBalance(wallet_id: string, balance: string, manager: EntityManager) {
    return manager.update(Wallet, 
      { id     : wallet_id },
      { balance: balance   }
    )
  }
}
