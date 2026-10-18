import {
    Body, Controller, Get, Param, Post, Req,
    UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';

import { JwtGuard }           from '../guard/jwt.guard.js';
import { TransactionDto }     from './dto/transaction.dto.js';
import { TransactionService } from './transaction.service.js';
import { paymentPolicy }      from './payment.policy.js';

import type { UserRequest } from '../guard/jwt.guard.js';

@UseGuards(JwtGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactions: TransactionService) {}

    @Post()
    create(
        @Body() body: TransactionDto,
        @Req()  req : UserRequest
    ) {
        return this.transactions.create(req.userId, body)
    }

    @Get()
    findAll(@Req() req: UserRequest) {
        return this.transactions.findAll(req.userId)
    }

    @Get('policy')
    policy() {
        return paymentPolicy
    }

    @Get('sales')
    findSales(@Req() req: UserRequest) {
        return this.transactions.findSales(req.userId)
    }

    @Get(':tid')
    findOne(
        @Param('tid') tid: string,
        @Req()        req: UserRequest
    ) {
        return this.transactions.findOne(tid, req.userId)
    }

    @Post(':tid/pay')
    pay(
        @Param('tid') tid: string,
        @Req()        req: UserRequest
    ) {
        return this.transactions.pay(tid, req.userId)
    }

    @Post(':tid/cancel')
    cancel(
        @Param('tid') tid: string,
        @Req()        req: UserRequest
    ) {
        return this.transactions.cancel(tid, req.userId)
    }

    @Post(':tid/confirm')
    confirm(
        @Param('tid') tid: string,
        @Req()        req: UserRequest
    ) {
        return this.transactions.confirm(tid, req.userId)
    }
}
