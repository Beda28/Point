import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PointRepository, RecordExistsError } from './point.repository.js';
import { createHash, randomUUID }      from 'node:crypto';
import { DataSource }      from 'typeorm';
import { RequestRecord } from '../database/entities/record.entity.js';

@Injectable()
export class PointService {
  constructor(
    private readonly pointRepository: PointRepository,
    private readonly dataSource     : DataSource 
  ) {}

  private checkRecord(record: RequestRecord, reqHash: string) {
    if (record.req_hash !== reqHash)                      throw new ConflictException('Request key already used with different data')
    if (record.status   !== 'COMPLETED' || !record.tx_id) throw new ConflictException('Request is processing')
    return record.tx_id
  }

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

  async deactivateWallet(clientId: string, userId: string){
    const wallet = await this.pointRepository.findWallet(clientId, { user_id: userId })
    if (!wallet)   throw new NotFoundException('Wallet not found');

    await this.pointRepository.deActiveWallet(clientId, userId)
  }

  async getTransactions(clientId: string, userId: string){
    const wallet = await this.pointRepository.findWallet(clientId, { user_id: userId })
    if (!wallet)   throw new NotFoundException('Wallet not found');

    return         await this.pointRepository.getTransactions(wallet.id)
  }

  async earnPoints(clientId: string, reqKey: string | undefined, userId: string, amount: number, ref_id: string){
    if (!reqKey)    throw new BadRequestException('Idempotency-Key is required')
    const reqHash = createHash('sha256').update(JSON.stringify(['EARN', userId, amount, ref_id])).digest('hex')

    try {
      return await this.dataSource.transaction(async (manager) => {
        const record = await this.pointRepository.findRecord(clientId, reqKey, manager)
        if (record)    return { transaction_id: this.checkRecord(record, reqHash) }

        await this.pointRepository.initRecord(clientId, reqKey, reqHash, manager)

        const wallet  = await this.pointRepository.findWallet(clientId, { user_id: userId }, manager)

        if (!wallet)                    throw new NotFoundException('Wallet not found');
        if (wallet.status !== 'ACTIVE') throw new BadRequestException('Wallet is inactive');
    
        const id      = randomUUID();
        const balance = BigInt(wallet.balance) + BigInt(amount)
    
        await this.pointRepository.updateBalance  (wallet.id, String(balance), manager)
        await this.pointRepository.addTransactions(id, wallet.id, 'EARN', String(amount), String(balance), ref_id, manager)
        await this.pointRepository.updateRecord(clientId, reqKey, id, manager)

        return { transaction_id: id }
      })
    } catch (e) {
      if (!(e instanceof RecordExistsError)) throw e

      return await this.dataSource.transaction(async (manager) => {
        const record = await this.pointRepository.findRecord(clientId, reqKey, manager)
        if (!record)   throw e

        return { transaction_id: this.checkRecord(record, reqHash) }
      })
    }
  }

  async spendPoints(clientId: string, reqKey: string | undefined, userId: string, amount: number, ref_id: string) {
    if (!reqKey)    throw new BadRequestException('Idempotency-Key is required')
    const reqHash = createHash('sha256').update(JSON.stringify(['SPEND', userId, amount, ref_id])).digest('hex')
    
    try {
      return await this.dataSource.transaction(async (manager) => {
        const record = await this.pointRepository.findRecord(clientId, reqKey, manager)
        if (record)    return { transaction_id: this.checkRecord(record, reqHash) }

        await this.pointRepository.initRecord(clientId, reqKey, reqHash, manager)

        const wallet  = await this.pointRepository.findWallet(clientId, { user_id: userId }, manager)

        if (!wallet)                    throw new NotFoundException('Wallet not found');
        if (wallet.status !== 'ACTIVE') throw new BadRequestException('Wallet is inactive');

        const id      = randomUUID();
        const balance = BigInt(wallet.balance) - BigInt(amount)

        if (balance < 0n) throw new BadRequestException('Insufficient balance')
        
        await this.pointRepository.updateBalance  (wallet.id, String(balance), manager)
        await this.pointRepository.addTransactions(id, wallet.id, 'SPEND', String(amount), String(balance), ref_id, manager)
        await this.pointRepository.updateRecord(clientId, reqKey, id, manager)

        return { transaction_id: id }
      })
    } catch (e) {
      if (!(e instanceof RecordExistsError)) throw e

      return await this.dataSource.transaction(async (manager) => {
        const record = await this.pointRepository.findRecord(clientId, reqKey, manager)
        if (!record)   throw e

        return { transaction_id: this.checkRecord(record, reqHash) }
      })
    }
  }

  async reverseTransaction(transaction_id: string, clientId: string, reqKey: string | undefined) {
    if (!reqKey) throw new BadRequestException('Idempotency-Key is required')
    const reqHash = createHash('sha256').update(JSON.stringify(['REVERSE', transaction_id])).digest('hex')

    try {
      return await this.dataSource.transaction(async (manager) => {
        const record = await this.pointRepository.findRecord(clientId, reqKey, manager)
        if (record)    return { transaction_id: this.checkRecord(record, reqHash) }

        await this.pointRepository.initRecord(clientId, reqKey, reqHash, manager)
        
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
        await this.pointRepository.updateRecord(clientId, reqKey, id, manager)

        return { transaction_id: id }
      })
    } catch (e) {
      if (!(e instanceof RecordExistsError)) throw e

      return await this.dataSource.transaction(async (manager) => {
        const record = await this.pointRepository.findRecord(clientId, reqKey, manager)
        if (!record)   throw e

        return { transaction_id: this.checkRecord(record, reqHash) }
      })
    }
  }
}
