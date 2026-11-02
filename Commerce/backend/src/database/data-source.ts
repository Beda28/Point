import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity.js';
import { Product } from './entities/product.entity.js';
import { Transaction } from './entities/transaction.entity.js';

export default new DataSource({
  type             : 'mysql',
  host             : process.env.DB_HOST,
  port             : Number(process.env.DB_PORT ?? 3306),
  username         : process.env.DB_USER,
  password         : process.env.DB_PASSWORD,
  database         : process.env.DB_NAME,
  entities         : [User, Product, Transaction],
  synchronize      : false,
  supportBigNumbers: true,
  bigNumberStrings : true,
});
