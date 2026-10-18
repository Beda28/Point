import { Injectable }       from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository }       from "typeorm";

import { Product }     from "../database/entities/product.entity.js";
import { Transaction } from "../database/entities/transaction.entity.js";

@Injectable()
export class TransactionRepository{
    constructor (
        @InjectRepository(Transaction)
        private readonly transactions: Repository<Transaction>,

        @InjectRepository(Product)
        private readonly products    : Repository<Product>
    ) {}

    async findProduct(pid: string) {
        return this.products.findOneBy({ pid })
    }

    async findOne(tid: string, uid: string) {
        return this.transactions.findOneBy({ tid, uid })
    }

    async findAll(uid: string) {
        return this.transactions.find({
            where: { uid },
            order: { created_at: 'DESC', tid: 'DESC'}
        })
    }

    async findSales(seller_id: string) {
        return this.transactions.find({
            where: { seller_id },
            order: { created_at: 'DESC', tid: 'DESC' }
        })
    }

    async create(
        tid         : string, pid       : string, uid: string,
        quantity    : number, unit_price: string,
        total_amount: string, point_used: string, amount: string,
        seller_id   : string, fee: string, seller_amount: string, point_earned: string
    ) {
        await this.transactions.insert({
            tid, pid, uid, quantity,
            unit_price, total_amount,
            point_used, amount,
            seller_id, fee, seller_amount, point_earned,
            status: 'PENDING'
        })

        return this.findOne(tid, uid)
    }

    async transaction(
        tid: string, uid: string,  from : Transaction['status'],
        to: Transaction['status'], patch: Partial<Transaction> = {}
    ) {
        const result = await this.transactions.update(
            { tid, uid, status: from },
            { ...patch, status: to }
        )

        return result.affected === 1;
    }
}
