import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository }              from '@nestjs/typeorm';
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

  findWallet(clientId: string, walletId: string): Promise<Wallet | null> {
    return this.wallets.findOneBy({ client_id: clientId, id: walletId });
  }

  async initWallet(id: string, client_id: string, user_id: string): Promise<Wallet> {
    const wallet = await this.wallets.findOneBy({ client_id, user_id });
    if (wallet)    return wallet;

    await this.wallets.insert({
      id, client_id, user_id,
      balance: '0',
      status : 'ACTIVE',
    });

    return this.wallets.findOneByOrFail({ id, client_id, user_id });
  }

  async getTransactions(client_Id: string, walletId: string): Promise<Transaction[]> {
    const wallet = await this.wallets.findOneBy({ client_id: client_Id, id: walletId})

    if (!wallet) throw new NotFoundException('Wallet not found');

    return await this.transactions.find({where: {wallet_id: wallet.id}, order: {created_at: 'DESC', id: 'DESC'}})
  }
}
