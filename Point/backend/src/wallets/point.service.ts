import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PointRepository } from './point.repository.js';
import { randomUUID }      from 'node:crypto';
import { DataSource }      from 'typeorm';

@Injectable()
export class PointService {
  constructor(
    private readonly pointRepository: PointRepository,
    private readonly dataSource     : DataSource 
  ) {}

  async findWallet(clientId: string, userId: string) {
    const wallet = await this.pointRepository.findWallet(clientId, { user_id: userId });
    if (!wallet)   throw new NotFoundException('Wallet not found');

    return wallet;
  }

  async initWallet(clientId: string, userId: string) {
    const wallet = await this.pointRepository.findWallet(clientId, { user_id: userId })
    if (wallet)    throw new ConflictException('Wallet already exists');

    const id     = randomUUID();
    return await this.pointRepository.initWallet(id, clientId, userId)
  }

  async getTransactions(clientId: string, userId: string){
    const wallet = await this.pointRepository.findWallet(clientId, { user_id: userId })
    if (!wallet)   throw new NotFoundException('Wallet not found');

    return         await this.pointRepository.getTransactions(wallet.id)
  }

  async earnPoints(clientId: string, userId: string, amount: number, ref_id: string){
    return this.dataSource.transaction(async (manager) => {
      const wallet  = await this.pointRepository.findWallet(clientId, { user_id: userId }, manager)

      if (!wallet)                    throw new NotFoundException('Wallet not found');
      if (wallet.status !== 'ACTIVE') throw new BadRequestException('Wallet is inactive');
  
      const id      = randomUUID();
      const balance = BigInt(wallet.balance) + BigInt(amount)
  
      await this.pointRepository.updateBalance  (wallet.id, String(balance), manager)
      await this.pointRepository.addTransactions(id, wallet.id, 'EARN', String(amount), String(balance), ref_id, manager)

      return { transaction_id: id }
    })
  }

  async spendPoints(clientId: string, userId: string, amount: number, ref_id: string) {
    return this.dataSource.transaction(async (manager) => {
      const wallet  = await this.pointRepository.findWallet(clientId, { user_id: userId }, manager)

      if (!wallet)                    throw new NotFoundException('Wallet not found');
      if (wallet.status !== 'ACTIVE') throw new BadRequestException('Wallet is inactive');

      const id      = randomUUID();
      const balance = BigInt(wallet.balance) - BigInt(amount)

      if (balance < 0n) throw new BadRequestException('Insufficient balance')
      
      await this.pointRepository.updateBalance  (wallet.id, String(balance), manager)
      await this.pointRepository.addTransactions(id, wallet.id, 'SPEND', String(amount), String(balance), ref_id, manager)

      return { transaction_id: id }
    })
  }

  async reverseTransaction(transaction_id: string, clientId: string) {
    return this.dataSource.transaction(async (manager) => {
      const transaction = await this.pointRepository.findTransactions({ id: transaction_id }, manager)
      if (!transaction)                  throw new NotFoundException('Transaction not found');
      if (transaction.type == 'REVERSE') throw new BadRequestException('Cannot reverse a reversal')

      const wallet      = await this.pointRepository.findWallet(clientId, { id: transaction.wallet_id }, manager)
      if (!wallet)                    throw new NotFoundException('Wallet not found');
      if (wallet.status !== 'ACTIVE') throw new BadRequestException('Wallet is inactive');

      const reversal = await this.pointRepository.findTransactions({ original_id: transaction.id }, manager)
      if (reversal)    throw new ConflictException('Transaction already reversed');

      const id      = randomUUID();
      const amount  = BigInt(transaction.amount)
      const balance = transaction.type === 'EARN'
        ? BigInt(wallet.balance) - amount
        : BigInt(wallet.balance) + amount;

      if (balance < 0n) throw new BadRequestException('Insufficient balance');
        
      await this.pointRepository.updateBalance(wallet.id, String(balance), manager)
      await this.pointRepository.addTransactions(id, wallet.id, 'REVERSE', String(amount), String(balance), transaction.ref_id, manager, transaction.id)
    })
  }

  async deactivateWallet(clientId: string, userId: string){
    const wallet = await this.pointRepository.findWallet(clientId, { user_id: userId })
    if (!wallet)   throw new NotFoundException('Wallet not found');

    await this.pointRepository.deActiveWallet(clientId, userId)
  }
}
