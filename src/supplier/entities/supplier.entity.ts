import { Product } from 'src/product/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 150, unique: true })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
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

  //Relations
  //products
  @OneToMany(() => Product, (product) => product.supplier, { cascade: true })
  products: Product[];
}
