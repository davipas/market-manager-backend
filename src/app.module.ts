import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SupplierModule } from './supplier/supplier.module';
import { ClientModule } from './client/client.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PurchaseDetailsModule } from './purchase-details/purchase-details.module';
import { SaleModule } from './sale/sale.module';
import { SaleDetailsModule } from './sale-details/sale-details.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    CommonModule,
    ProductModule,
    CategoryModule,
    SupplierModule,
    ClientModule,
    PurchaseModule,
    PurchaseDetailsModule,
    SaleModule,
    SaleDetailsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
