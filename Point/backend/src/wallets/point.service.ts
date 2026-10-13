import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PointRepository } from './point.repository.js';
import { randomUUID }      from 'node:crypto';
import { DataSource, ManyToMany }      from 'typeorm';

@Injectable()
export class PointService {
  constructor(
    private readonly pointRepository: PointRepository,
    private readonly dataSource     : DataSource 
  ) {}

  async findWallet(clientId: string, userId: string) {
    const wallet = await this.pointRepository.findWallet(clientId, userId);
    if (!wallet)   throw new NotFoundException('Wallet not found');

    return wallet;
  }

  async initWallet(clientId: string, userId: string) {
    const wallet = await this.pointRepository.findWallet(clientId, userId)
    if (wallet)    throw new ConflictException('Wallet already exists');

    const id     = randomUUID();
    return await this.pointRepository.initWallet(id, clientId, userId)
  }

  async getTransactions(clientId: string, userId: string){
    const wallet = await this.pointRepository.findWallet(clientId, userId)
    if (!wallet)   throw new NotFoundException('Wallet not found');

    return         await this.pointRepository.getTransactions(wallet.id)
  }

  async earnPoints(clientId: string, userId: string, amount: number, ref_id: string){
    return this.dataSource.transaction(async (manager) => {
      const wallet  = await this.pointRepository.findWallet(clientId, userId, manager)
      if (!wallet)    throw new NotFoundException('Wallet not found');
  
      const id      = randomUUID();
      const balance = BigInt(wallet.balance) + BigInt(amount)
  
      await this.pointRepository.updateBalance  (wallet.id, String(balance), manager)
      await this.pointRepository.addTransactions(id, wallet.id, 'EARN', String(amount), String(balance), ref_id, manager)
    })

  }

  async spendPoints(clientId: string, userId: string, amount: number, ref_id: string) {
    return this.dataSource.transaction(async (manager) => {
      const wallet  = await this.pointRepository.findWallet(clientId, userId, manager)
      if (!wallet)    throw new NotFoundException('Wallet not found');

      const id      = randomUUID();
      const balance = BigInt(wallet.balance) - BigInt(amount)

      if (balance < 0n) throw new BadRequestException('Insufficient balance')
      
      await this.pointRepository.updateBalance  (wallet.id, String(balance), manager)
      await this.pointRepository.addTransactions(id, wallet.id, 'SPEND', String(amount), String(balance), ref_id, manager)
    })
  }
}
