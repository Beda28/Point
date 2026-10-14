import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'char', length: 36 })
  pid: string;

  @Column({ type: 'varchar', length: 255 })
  pname: string;

  @Column({ type: 'bigint' })
  price: string;

  @Column({ type: 'text' })
  content: string;
}
