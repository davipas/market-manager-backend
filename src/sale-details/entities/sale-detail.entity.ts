import { Product } from 'src/product/entities/product.entity';
import { Sale } from 'src/sale/entities/sale.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('sale_details')
export class SaleDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  discount: number;

  @Column({ type: 'int' })
  quantity: number;

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

  @ManyToOne(() => Product, (product) => product.saleDetails)
  product: Product;

  //sale
  @Column()
  saleId: string;

  @ManyToOne(() => Sale, (sale) => sale.details)
  sale: Sale;
}
