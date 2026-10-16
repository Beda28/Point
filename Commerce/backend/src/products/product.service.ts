import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID }        from 'node:crypto';
import { QueryFailedError }  from 'typeorm';
import type { ProductDto }   from './dto/product.dto.js';
import { ProductRepository } from './product.repository.js';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll(uid?: string) {
    return this.productRepository.findAll(uid);
  }

  async findOne(pid: string, uid?: string) {
    const product = await this.productRepository.findOne(pid);
    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다');
    if (uid && product.uid !== uid) throw new ForbiddenException('본인이 등록한 상품만 변경할 수 있습니다');
    return product;
  }

  async create(body: ProductDto, uid: string) {
    const pid = randomUUID();
    await this.productRepository.create(pid, body, uid);
    return this.findOne(pid);
  }

  async update(pid: string, body: ProductDto, uid: string) {
    await this.findOne(pid, uid);
    await this.productRepository.update(pid, body);
    return this.findOne(pid);
  }

  async remove(pid: string, uid: string) {
    await this.findOne(pid, uid);
    try {
      await this.productRepository.remove(pid);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('거래 내역이 있는 상품은 삭제할 수 없습니다');
      }
      throw error;
    }
    return { pid };
  }
}
