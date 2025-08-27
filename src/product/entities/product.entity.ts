import { Category } from 'src/category/entities/category.entity';
import { PurchaseDetail } from 'src/purchase-details/entities/purchase-detail.entity';
import { SaleDetail } from 'src/sale-details/entities/sale-detail.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, unique: true, nullable: true })
  barcode: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

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
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column('boolean', { default: true })
  isActive: boolean;

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

  //category
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  //supplier
  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  supplier: Supplier;

  @Column({ nullable: true })
  supplierId: string;

  // Sale details

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.product)
  saleDetails: SaleDetail[];

  // Purchase details
  @OneToMany(() => PurchaseDetail, (purchaseDetail) => purchaseDetail.product)
  purchaseDetails: PurchaseDetail[];
}
