import {
  BadRequestException,
  Controller, Get, Post, Body,
  Param, Query, ParseUUIDPipe
} from '@nestjs/common';

import { PointService }  from './point.service.js';
import { InitWalletDto } from './dto/init-wallet.dto.js'

@Controller()
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('wallets')
  initWallet(@Body() body: InitWalletDto) {
    return this.pointService.initWallet(
      body.client_id,
      body.user_id
    )
  }

  @Get('wallets/:id')
  getWallet(
    @Param('id', ParseUUIDPipe) walletId: string,
    @Query('clientId')          clientId: string,
  ) {
    if (typeof clientId !== 'string' || !clientId.trim()) {
      throw new BadRequestException('clientId is required');
    }

    return this.pointService.findWallet(clientId, walletId);
  }
}
