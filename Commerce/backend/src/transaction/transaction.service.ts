import {
    Injectable, BadRequestException, ConflictException,
    NotFoundException, ServiceUnavailableException
 } from "@nestjs/common";

import { randomUUID } from "node:crypto";

import { PointApiError, PointClient } from "../point/point.client.js";
import { TransactionRepository }      from "./transaction.repository.js";
import { TransactionDto }             from "./dto/transaction.dto.js";
import { paymentPolicy }              from "./payment.policy.js";

@Injectable()
export class TransactionService {
    constructor (
        private readonly transactions: TransactionRepository,
        private readonly pointClient : PointClient
    ) {}

    private async findOwned(tid: string, uid: string) {
        const transaction = await this.transactions.findOne(tid, uid)
        if (!transaction)   throw new NotFoundException('Transaction not found')
        return transaction
    }

    private pointError(error: unknown): never {
        if (error instanceof PointApiError) {
            if (error.status === 400 || error.status === 404) throw new BadRequestException('Point wallet or balance is invalid')
            if (error.status === 409)                         throw new ConflictException  ('Point request is processing or conflicting')
        }
        throw new ServiceUnavailableException('Point payment result is uncertain. Retry the same transaction.')
    }

    async create(uid: string, body: TransactionDto) {
        const product = await this.transactions.findProduct(body.pid)
        if (!product)   throw new NotFoundException('Product not Found')
        if (product.uid === uid) throw new BadRequestException('본인의 상품은 구매할 수 없습니다')

        const unitPrice = BigInt(product.price)
        const quantity  = BigInt(body.quantity)
        const pointUsed = BigInt(body.point_used ?? 0)
        const total     = unitPrice * quantity
        const amount    = total - pointUsed * BigInt(paymentPolicy.point_value)
        const fee       = total * BigInt(paymentPolicy.fee_bps) / 10000n
        const reward    = amount * BigInt(paymentPolicy.reward_bps) / 10000n

        if (unitPrice <= 0n) throw new BadRequestException('Invalid product price')
        if (amount     < 0n) throw new BadRequestException('Point exceeds total amount')
        if (total > BigInt(Number.MAX_SAFE_INTEGER))
                             throw new BadRequestException('Amount exceeds supported limit')

        const tid = randomUUID()

        return this.transactions.create(
            tid, body.pid,     uid, body.quantity,
            String(unitPrice), String(total),
            String(pointUsed), String(amount),
            product.uid, String(fee), String(total - fee), String(reward)
        )
    }

    async findAll(uid: string) {
        return this.transactions.findAll(uid)
    }

    async findSales(uid: string) {
        return this.transactions.findSales(uid)
    }

    async findOne(tid: string, uid: string) {
        return this.findOwned(tid, uid)
    }

    async pay(tid: string, uid: string) {
        const current = await this.findOwned(tid, uid)

        if (current.status === 'COMPLETED' || current.status === 'CONFIRMED') return current
        if (current.status !== 'PENDING' && current.status !== 'PAYING') throw new ConflictException('Transaction cannot be paid')
        if (current.status === 'PENDING')   await this.transactions.transaction(tid, uid, 'PENDING', 'PAYING')

        const transaction = await this.findOwned(tid, uid)
        if (transaction.status === 'COMPLETED') return transaction
        if (transaction.status !== 'PAYING')    throw  new ConflictException('Transaction status changed')

        let result: any;

        try {
            result = await this.pointClient.request('/wallets/spend', 'POST', {
                user_id: uid,
                amount : Number(transaction.amount),
                ...(BigInt(transaction.point_used) > 0n
                    ? { point: Number(transaction.point_used) }
                    : {}),
                ref_id : tid },
                `payment:${tid}`
            )
        } catch (e) {
            this.pointError(e)
        }

        if (typeof result?.transaction_id !== 'string') throw new ServiceUnavailableException('Invalid Point payment response')

        await this.transactions.transaction(tid, uid, 'PAYING', 'COMPLETED', { point_tid: result.transaction_id })
        const updated = await this.findOwned(tid, uid)

        if (
            updated.status    !== 'COMPLETED' ||
            updated.point_tid !== result.transaction_id
        )   throw new ConflictException('Payment finalization conflict')

        return updated
    }

    async cancel(tid: string, uid: string) {
        const current = await this.findOwned(tid, uid)

        if (current.status === 'CANCELED') return current
        if (current.status !== 'COMPLETED' && current.status !== 'REFUNDING') throw new ConflictException('Transaction cannot be canceled')
        if (!current.point_tid) throw new ConflictException('Payment transaction ID missing')
        if (current.status === 'COMPLETED') await this.transactions.transaction(tid, uid, 'COMPLETED', 'REFUNDING')

        const transaction = await this.findOwned(tid, uid)
        if (transaction.status === 'CANCELED')  return transaction
        if (transaction.status !== 'REFUNDING') throw new ConflictException('Transaction status changed')

        let result: any;

        try {
            result = await this.pointClient.request(
                '/transactions/reverse', 'POST',
                { transaction_id: transaction.point_tid },
                `refund:${tid}`
            )
        } catch (e) {
            this.pointError(e)
        }

        if (typeof result?.transaction_id !== 'string') throw new ServiceUnavailableException('Invalid Point refund response')

        await this.transactions.transaction(tid, uid, 'REFUNDING', 'CANCELED', { point_refund_tid: result.transaction_id })
        const updated = await this.findOwned(tid, uid)

        if (
            updated.status           !== 'CANCELED' ||
            updated.point_refund_tid !== result.transaction_id
        )   throw new ConflictException('Refund finalization conflict')

        return updated
    }

    async confirm(tid: string, uid: string) {
        const current = await this.findOwned(tid, uid)

        if (current.status === 'CONFIRMED') return current
        if (current.status !== 'COMPLETED' && current.status !== 'CONFIRMING') throw new ConflictException('구매확정할 수 없는 주문입니다')
        if (!current.point_tid) throw new ConflictException('Payment transaction ID missing')
        if (current.status === 'COMPLETED') await this.transactions.transaction(tid, uid, 'COMPLETED', 'CONFIRMING')

        const transaction = await this.findOwned(tid, uid)
        if (transaction.status === 'CONFIRMED') return transaction
        if (transaction.status !== 'CONFIRMING') throw new ConflictException('Transaction status changed')

        let result: any;

        try {
            await this.pointClient.findWallet(transaction.seller_id)
            result = await this.pointClient.request('/transactions/settle', 'POST', {
                transaction_id: transaction.point_tid,
                seller_id     : transaction.seller_id,
                amount        : Number(transaction.seller_amount),
                point         : Number(transaction.point_earned),
            }, `settlement:${tid}`)
        } catch (e) {
            this.pointError(e)
        }

        if (typeof result?.transaction_id !== 'string') throw new ServiceUnavailableException('Invalid Point settlement response')

        await this.transactions.transaction(tid, uid, 'CONFIRMING', 'CONFIRMED', { point_settle_tid: result.transaction_id })
        const updated = await this.findOwned(tid, uid)
        if (
            updated.status           !== 'CONFIRMED' ||
            updated.point_settle_tid !== result.transaction_id
        ) throw new ConflictException('Settlement finalization conflict')

        return updated
    }
}
