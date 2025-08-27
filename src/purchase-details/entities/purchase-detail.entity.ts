import { Product } from 'src/product/entities/product.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('purchase_details')
export class PurchaseDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column('decimal', {
    name: 'unit_price',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      from: (value: string): number | null =>
        value === null ? null : parseFloat(value),
      to: (value: number): number => value,
    },
  })
  unitPrice: number;

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
  subtotal: number;

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
  //product
  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.purchaseDetails)
  product: Product;
  //sale
  @Column()
  purchaseId: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.details)
  purchase: Purchase;
}
