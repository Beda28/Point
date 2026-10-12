import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('records')
export class RequestRecord {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  client_id: string;

  @PrimaryColumn({ type: 'varchar', length: 128 })
  req_key: string;

  @Column({ type: 'char', length: 64 })
  req_hash: string;

  @Column({ type: 'enum', enum: ['PROCESSING', 'COMPLETED'], default: 'PROCESSING' })
  status: 'PROCESSING' | 'COMPLETED';

  @Column({ type: 'char', length: 36, nullable: true })
  tx_id: string | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
