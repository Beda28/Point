import {
  Controller, Get, Post, Patch, Body,
  Param, ParseUUIDPipe, UseGuards, Req
} from '@nestjs/common';

import { PointService }  from './point.service.js';
import { InitWalletDto } from './dto/init-wallet.dto.js'
import { ApiKeyGuard }   from '../auth/api-key.guard.js';

import type { ClientRequest } from '../auth/api-key.guard.js';

@UseGuards(ApiKeyGuard)
@Controller()
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('wallets')
  initWallet(
    @Body() body   : InitWalletDto,
    @Req() request : ClientRequest,
  ) {
    return this.pointService.initWallet(
      request.client_id,
      body.user_id
    )
  }

  @Get('wallets/:id')
  getWallet(
    @Param('id', ParseUUIDPipe) walletId: string,
    @Req()                      request : ClientRequest,
  ) {
    return this.pointService.findWallet(request.client_id, walletId);
  }

  @Get('wallets/:id/transactions')
  getTransactions(
    @Param('id', ParseUUIDPipe) walletId : string,
    @Req()                      request : ClientRequest,
  ) {
    return this.pointService.getTransactions(request.client_id, walletId)
  }

  @Post('wallets/earn')
  earnPoints() {}

  @Post('wallets/spend')
  spendPoints() {}

  @Post('transactions/reverse')
  reverseTransaction() {}

  @Patch('wallets/:id')
  deactivateWallet() {}
}
