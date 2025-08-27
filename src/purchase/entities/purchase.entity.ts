import { User } from 'src/auth/entities';
import { PurchaseDetail } from 'src/purchase-details/entities/purchase-detail.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
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

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
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
  //purchase details
  @OneToMany(() => PurchaseDetail, (detail) => detail.purchase)
  details: PurchaseDetail[];
  //supplier
  @Column()
  supplierId: string;
  @ManyToOne(() => Supplier)
  supplier: Supplier;
}
