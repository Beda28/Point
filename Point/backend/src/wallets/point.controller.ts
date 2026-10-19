import {
  Controller, Get, Post, Patch, Body,
  Param, UseGuards, Req
} from '@nestjs/common';

import { PointService }  from './point.service.js';
import { InitWalletDto } from './dto/init-wallet.dto.js'
import { ApiKeyGuard }   from '../auth/api-key.guard.js';
import { PointChangeDto } from './dto/point-change.dto.js';

import type { ClientRequest } from '../auth/api-key.guard.js';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto.js';
import { SettleDto } from './dto/settle.dto.js';

@UseGuards(ApiKeyGuard)
@Controller()
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('wallets')
  initWallet(
    @Body() body    : InitWalletDto,
    @Req()  request : ClientRequest,
  ) {
    return this.pointService.initWallet(
      request.clientId,
      body   .user_id
    )
  }

  @Get('wallets/:id')
  getWallet(
    @Param('id') userId  : string,
    @Req()       request : ClientRequest,
  ) {
    return this.pointService.findWallet(request.clientId, userId);
  }

  @Get('wallets/:id/transactions')
  getTransactions(
    @Param('id') userId  : string,
    @Req()       request : ClientRequest,
  ) {
    return this.pointService.getTransactions(request.clientId, userId)
  }

  @Post('wallets/earn')
  earnPoints(
    @Body() body   : PointChangeDto,
    @Req()  request: ClientRequest
  ) {
    return this.pointService.editPoints(request.clientId, request.reqKey, body.user_id, 'EARN', body.amount, body.ref_id, body.point)
  }

  @Post('wallets/spend')
  spendPoints(
    @Body() body   : PointChangeDto,
    @Req()  request: ClientRequest
  ) {
    return this.pointService.editPoints(request.clientId, request.reqKey, body.user_id, 'SPEND', body.amount, body.ref_id, body.point, body.seller_id)
  }

  @Post('transactions/reverse')
  reverseTransaction(
    @Body() body   : ReverseTransactionDto,
    @Req()  request: ClientRequest
  ) {
    return this.pointService.reverseTransaction(body.transaction_id, request.clientId, request.reqKey)
  }

  @Patch('wallets/:id')
  deactivateWallet(
    @Param('id') userId : string,
    @Req()       request: ClientRequest
  ) {
    return this.pointService.deactivateWallet(request.clientId, userId)
  }

  @Post('transactions/settle')
  settle(
    @Body() body: SettleDto,
    @Req() request: ClientRequest
  ) {
    return this.pointService.settleTransaction(request.clientId, request.reqKey, body)
  }
}
