import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard }       from '../guard/jwt.guard.js';
import type { UserRequest } from '../guard/jwt.guard.js';
import { ProductDto }     from './dto/product.dto.js';
import { ProductService } from './product.service.js';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('me')
  @UseGuards(JwtGuard)
  findMine(@Req() req: UserRequest) {
    return this.productService.findAll(req.userId);
  }

  @Get(':pid')
  findOne(@Param('pid') pid: string) {
    return this.productService.findOne(pid);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() body: ProductDto, @Req() req: UserRequest) {
    return this.productService.create(body, req.userId);
  }

  @Put(':pid')
  @UseGuards(JwtGuard)
  update(@Param('pid') pid: string, @Body() body: ProductDto, @Req() req: UserRequest) {
    return this.productService.update(pid, body, req.userId);
  }

  @Delete(':pid')
  @UseGuards(JwtGuard)
  remove(@Param('pid') pid: string, @Req() req: UserRequest) {
    return this.productService.remove(pid, req.userId);
  }
}
