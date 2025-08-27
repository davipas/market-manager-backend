import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase-detail.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseDetail } from './entities/purchase-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseDetailsService {
  constructor(
    @InjectRepository(PurchaseDetail)
    private readonly purchaseDetailRepository: Repository<PurchaseDetail>,
  ) {}
  async create(createPurchaseDetailDto: CreatePurchaseDetailDto) {
    const purchaseDetail = this.purchaseDetailRepository.create(
      createPurchaseDetailDto,
    );
    return await this.purchaseDetailRepository.save(purchaseDetail);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.purchaseDetailRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const purchaseDetail = await this.purchaseDetailRepository.findOne({
      where: { id },
    });
    if (!purchaseDetail) {
      throw new NotFoundException(`PurchaseDetail with id ${id} not found`);
    }
    return purchaseDetail;
  }

  async update(id: string, updatePurchaseDetailDto: UpdatePurchaseDetailDto) {
    const purchaseDetail = await this.purchaseDetailRepository.preload({
      id,
      ...updatePurchaseDetailDto,
    });
    if (!purchaseDetail) {
      throw new NotFoundException(`PurchaseDetail with id ${id} not found`);
    }
    return await this.purchaseDetailRepository.save(purchaseDetail);
  }

  async remove(id: string) {
    const result = await this.purchaseDetailRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`PurchaseDetail with id ${id} not found`);
    }
  }
}
