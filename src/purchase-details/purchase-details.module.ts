import { Module } from '@nestjs/common';
import { PurchaseDetailsService } from './purchase-details.service';
import { PurchaseDetailsController } from './purchase-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseDetail } from './entities/purchase-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseDetail])],
  controllers: [PurchaseDetailsController],
  providers: [PurchaseDetailsService],
})
export class PurchaseDetailsModule {}
