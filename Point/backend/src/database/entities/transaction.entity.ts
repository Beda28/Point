import { Column, CreateDateColumn, Entity, PrimaryColumn, Index, Unique } from 'typeorm';

@Entity('transactions')
@Index(['wallet_id', 'created_at', 'id'])
@Unique(['original_id'])
export class Transaction {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'char', length: 36 })
  wallet_id: string;

  @Column({ type: 'enum', enum: ['EARN', 'SPEND', 'REVERSE', 'SETTLE'] })
  type: 'EARN' | 'SPEND' | 'REVERSE' | 'SETTLE';

  @Column({ type: 'bigint' })
  amount: string;

  @Column({ type: 'bigint' })
  balance: string;

  @Column({ type: 'bigint', nullable: true })
  point: string | null;

  @Column({ type: 'bigint', nullable: true })
  point_balance: string | null;

  @Column({ type: 'varchar', length: 128 })
  ref_id: string;

  @Column({ type: 'char', length: 36, nullable: true })
  original_id: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  seller_id: string | null;

  @Column({ type: 'bigint', nullable: true })
  settle_amount: string | null;

  @Column({ type: 'bigint', nullable: true })
  reward_point: string | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
