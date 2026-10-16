import { Module }            from '@nestjs/common';
import { TypeOrmModule }     from '@nestjs/typeorm';
import { AuthModule }        from '../auth/auth.module.js';
import { Product }           from '../database/entities/product.entity.js';
import { ProductController } from './product.controller.js';
import { ProductRepository } from './product.repository.js';
import { ProductService }    from './product.service.js';

@Module({
  imports    : [AuthModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers  : [ProductService, ProductRepository],
})
export class ProductModule {}
