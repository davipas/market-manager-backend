import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}
  async create(createPurchaseDto: CreatePurchaseDto) {
    const purchase = this.purchaseRepository.create(createPurchaseDto);
    return await this.purchaseRepository.save(purchase);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.purchaseRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const purchase = await this.purchaseRepository.findOne({ where: { id } });
    if (!purchase) {
      throw new NotFoundException(`Purchase with id ${id} not found`);
    }
    return purchase;
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.purchaseRepository.preload({
      id,
      ...updatePurchaseDto,
    });
    if (!purchase) {
      throw new NotFoundException(`Purchase with id ${id} not found`);
    }
    return await this.purchaseRepository.save(purchase);
  }

  async remove(id: string) {
    const result = await this.purchaseRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Purchase with id ${id} not found`);
    }
  }
}
