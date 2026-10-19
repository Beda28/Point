import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity.js';
import { Transaction } from './entities/transaction.entity.js';
import { RequestRecord } from './entities/record.entity.js';

export default new DataSource({
  type             : 'mysql',
  host             : process.env.DB_HOST,
  port             : Number(process.env.DB_PORT ?? 3306),
  username         : process.env.DB_USER,
  password         : process.env.DB_PASSWORD,
  database         : process.env.DB_NAME,
  entities         : [Wallet, Transaction, RequestRecord],
  synchronize      : false,
  supportBigNumbers: true,
  bigNumberStrings : true,
});
