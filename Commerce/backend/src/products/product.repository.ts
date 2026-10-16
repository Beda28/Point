import { Injectable }       from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { Product }          from '../database/entities/product.entity.js';
import type { ProductDto }  from './dto/product.dto.js';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async findAll(uid?: string) {
    return this.products.find({
      where: uid ? { uid } : {},
      order: { pname: 'ASC', pid: 'ASC' },
    });
  }

  async findOne(pid: string) {
    return this.products.findOneBy({ pid });
  }

  async create(pid: string, { pname, price, content }: ProductDto, uid: string) {
    return this.products.insert({ pid, uid, pname, price, content });
  }

  async update(pid: string, { pname, price, content }: ProductDto) {
    return this.products.update({ pid }, { pname, price, content });
  }

  async remove(pid: string) {
    return this.products.delete({ pid });
  }
}
