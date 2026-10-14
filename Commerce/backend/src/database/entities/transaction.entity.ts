import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn({ type: 'char', length: 36 })
  tid: string;

  @Column({ type: 'char', length: 36 })
  pid: string;

  @Column({ type: 'char', length: 36 })
  uid: string;

  @Column({ type: 'char', length: 36 })
  wid: string;

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

  @Column({ type: 'enum', enum: ['PENDING', 'COMPLETED', 'CANCELED', 'FAILED'], default: 'PENDING' })
  status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'FAILED';

  @Column({ type: 'char', length: 36, nullable: true })
  point_tid: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  point_refund_tid: string | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
