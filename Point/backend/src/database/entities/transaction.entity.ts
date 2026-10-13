import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'char', length: 36 })
  wallet_id: string;

  @Column({ type: 'enum', enum: ['EARN', 'SPEND', 'REVERSE'] })
  type: 'EARN' | 'SPEND' | 'REVERSE';

  @Column({ type: 'bigint' })
  amount: string;

  @Column({ type: 'bigint' })
  balance: string;

  @Column({ type: 'varchar', length: 128 })
  ref_id: string;

  @Column({ type: 'char', length: 36, nullable: true })
  original_id: string | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
