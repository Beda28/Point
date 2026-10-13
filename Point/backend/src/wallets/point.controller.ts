import {
  Controller, Get, Post, Patch, Body,
  Param, UseGuards, Req
} from '@nestjs/common';

import { PointService }  from './point.service.js';
import { InitWalletDto } from './dto/init-wallet.dto.js'
import { ApiKeyGuard }   from '../auth/api-key.guard.js';
import { PointChangeDto } from './dto/point-change.dto.js';

import type { ClientRequest } from '../auth/api-key.guard.js';

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
      request.client_id,
      body   .user_id
    )
  }

  @Get('wallets/:id')
  getWallet(
    @Param('id') userId  : string,
    @Req()       request : ClientRequest,
  ) {
    return this.pointService.findWallet(request.client_id, userId);
  }

  @Get('wallets/:id/transactions')
  getTransactions(
    @Param('id') userId  : string,
    @Req()       request : ClientRequest,
  ) {
    return this.pointService.getTransactions(request.client_id, userId)
  }

  @Post('wallets/earn')
  earnPoints(
    @Body() body   : PointChangeDto,
    @Req()  request: ClientRequest
  ) {
    return this.pointService.earnPoints(request.client_id, body.user_id, body.amount, body.ref_id)
  }

  @Post('wallets/spend')
  spendPoints(
    @Body() body   : PointChangeDto,
    @Req()  request: ClientRequest
  ) {
    return this.pointService.spendPoints(request.client_id, body.user_id, body.amount, body.ref_id)
  }

  @Post('transactions/reverse')
  reverseTransaction() {}

  @Patch('wallets/:id')
  deactivateWallet() {}
}
