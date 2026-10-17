import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity('wallets')
@Unique(['client_id', 'user_id'])
export class Wallet {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 64 })
  client_id: string;

  @Column({ type: 'varchar', length: 128 })
  user_id: string;

  @Column({ type: 'bigint', default: 0 })
  balance: string;

  @Column({ type: 'bigint', default: 0 })
  point: string;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
