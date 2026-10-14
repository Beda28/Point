import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryColumn({ type: 'char', length: 36 })
  wid: string;

  @Column({ type: 'char', length: 36, unique: true })
  uid: string;

  @Column({ type: 'bigint', default: 0 })
  balance: string;
}
