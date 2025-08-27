import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 150 })
  name: string;

  @Index()
  @Column('varchar', {
    length: 50,
    unique: true,
    nullable: true,
    name: 'identification',
  })
  identification: string;

  @Column('varchar', { length: 100, unique: true, nullable: true })
  email: string;

  @Column('varchar', { length: 20, nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  address: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
