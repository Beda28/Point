import { Column, CreateDateColumn, Entity, ForeignKey, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity.js';
import { User }    from './user.entity.js';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn({ type: 'char', length: 36 })
  tid: string;

  @Column({ type: 'char', length: 36 })
  @ForeignKey(() => Product, 'pid')
  pid: string;

  @Column({ type: 'char', length: 36 })
  @ForeignKey(() => User, 'uuid')
  uid: string;

  @Column({ type: 'char', length: 36 })
  seller_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'bigint' })
  unit_price: string;

  @Column({ type: 'bigint' })
  total_amount: string;

  @Column({ type: 'bigint', default: 0 })
  point_used: string;

  @Column({ type: 'bigint' })
  amount: string;

  @Column({ type: 'bigint' })
  fee: string;

  @Column({ type: 'bigint' })
  seller_amount: string;

  @Column({ type: 'bigint' })
  point_earned: string;

  @Column({ type: 'enum', enum: ['PENDING', 'PAYING', 'COMPLETED', 'REFUNDING', 'CANCELED', 'FAILED', 'CONFIRMING', 'CONFIRMED'], default: 'PENDING' })
  status: 'PENDING' | 'PAYING' | 'COMPLETED' | 'REFUNDING' | 'CANCELED' | 'FAILED' | 'CONFIRMING' | 'CONFIRMED';

  @Column({ type: 'char', length: 36, nullable: true })
  point_tid: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  point_refund_tid: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  point_settle_tid: string | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
