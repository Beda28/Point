import { Injectable, NotFoundException } from '@nestjs/common';
import { PointRepository }               from './point.repository.js';
import { randomUUID }                    from 'node:crypto';

@Injectable()
export class PointService {
  constructor(private readonly pointRepository: PointRepository) {}

  async findWallet(clientId: string, walletId: string) {
    const wallet = await this.pointRepository.findWallet(clientId, walletId);
    if (!wallet)   throw new NotFoundException('Wallet not found');

    return wallet;
  }

  async initWallet(client_id: string, user_id: string) {
    const id = randomUUID();

    return await this.pointRepository.initWallet(id, client_id, user_id)
  }

  async getTransactions(clientId: string, walletId: string){
    return await this.pointRepository.getTransactions(clientId, walletId)
  }
}
