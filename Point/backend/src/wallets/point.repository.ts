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

  async findWallet(clientId: string, target: { user_id: string } | { id: string }, manager?: EntityManager): Promise<Wallet | null> {
    const where = { ...target, client_id: clientId}

    if (manager) return manager.findOne(Wallet, {
      where,
      lock : { mode: 'pessimistic_write' }
    })

    return this.wallets.findOneBy(where);
  }

  async findWalletById(clientId: string, wallet_id: string, manager?: EntityManager): Promise<Wallet | null> {
    if (manager) return manager.findOne(Wallet, {
      where: { client_id: clientId, id: wallet_id },
      lock : { mode: 'pessimistic_write' }
    })

    return this.wallets.findOneBy({ client_id: clientId, id: wallet_id });
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
  
  async updateBalance(wallet_id: string, balance: string, manager: EntityManager) {
    return manager.update(Wallet, 
      { id     : wallet_id },
      { balance: balance   }
    )
  }

  async getTransactions(wallet_id: string): Promise<Transaction[]> {
    return this.transactions.find({
      where: {wallet_id : wallet_id},
      order: {created_at: 'DESC', id: 'DESC'}
    })
  }

  async findTransactions(target: { id: string } | { original_id: string }, manager?: EntityManager): Promise<Transaction | null> {
    if (manager) return await manager.findOne(Transaction, {
      where: target,
      lock : 'original_id' in target ? { mode: 'pessimistic_write' } : undefined
    })
    return await this.transactions.findOneBy(target)
  }

  async addTransactions(
    id    : string, wallet_id: string, type  : 'EARN' | 'SPEND' | 'REVERSE', 
    amount: string, balance  : string, ref_id: string, manager: EntityManager,
    original_id: string | null = null
  ) {
    return manager.insert(Transaction, {
      id    , wallet_id, type, 
      amount, balance  , ref_id,
      original_id
    })
  }
}
