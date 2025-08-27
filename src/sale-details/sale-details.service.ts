import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDetailDto } from './dto/create-sale-detail.dto';
import { UpdateSaleDetailDto } from './dto/update-sale-detail.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleDetail } from './entities/sale-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SaleDetailsService {
  constructor(
    @InjectRepository(SaleDetail)
    private readonly saleDetailRepository: Repository<SaleDetail>,
  ) {}
  async create(createSaleDetailDto: CreateSaleDetailDto) {
    const saleDetail = this.saleDetailRepository.create(createSaleDetailDto);
    return await this.saleDetailRepository.save(saleDetail);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.saleDetailRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const saleDetail = await this.saleDetailRepository.findOne({
      where: { id },
    });
    if (!saleDetail) {
      throw new NotFoundException(`saleDetail with id ${id} not found`);
    }
    return saleDetail;
  }

  async update(id: string, updateSaleDetailDto: UpdateSaleDetailDto) {
    const saleDetail = await this.saleDetailRepository.preload({
      id,
      ...updateSaleDetailDto,
    });
    if (!saleDetail) {
      throw new NotFoundException(`saleDetail with id ${id} not found`);
    }
    return await this.saleDetailRepository.save(saleDetail);
  }

  async remove(id: string) {
    const result = await this.saleDetailRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`saleDetail with id ${id} not found`);
    }
  }
}
