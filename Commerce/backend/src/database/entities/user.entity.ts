import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('users')
@Index('uq_users_id', ['id'], { unique: true })
export class User {
  @PrimaryColumn({ type: 'char', length: 36 })
  uuid: string;

  @Column({ type: 'varchar', length: 128 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  pw_hash: string;
}
