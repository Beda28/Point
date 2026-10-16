import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'char', length: 36 })
  pid: string;

  @Column({ type: 'char', length: 36 })
  uid: string;

  @Column({ type: 'varchar', length: 255 })
  pname: string;

  @Column({ type: 'bigint' })
  price: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
