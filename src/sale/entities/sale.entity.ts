import { User } from 'src/auth/entities';
import { Client } from 'src/client/entities/client.entity';
import { SaleDetail } from 'src/sale-details/entities/sale-detail.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      from: (value: string): number | null =>
        value === null ? null : parseFloat(value),
      to: (value: number): number => value,
    },
  })
  total: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'completed',
  })
  status: string;

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

  //Relations
  //sale details
  @OneToMany(() => SaleDetail, (detail) => detail.sale, {
    cascade: true,
    eager: true,
  })
  details: SaleDetail[];
  //client
  @Column({ nullable: true })
  clientId: string;

  @ManyToOne(() => Client)
  client: Client;
}
