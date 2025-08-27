import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dtos';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = this.supplierRepository.create(createSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { search, limit = 10, page = 1 } = paginationQueryDto;
    const offset = (page - 1) * limit;

    const whereConditions = search ? { name: ILike(`%${search.trim()}%`) } : {};

    const [data, total] = await this.supplierRepository.findAndCount({
      where: whereConditions,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findOne(id: string) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }
    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository.preload({
      id,
      ...updateSupplierDto,
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }
    return await this.supplierRepository.save(supplier);
  }

  async remove(id: string) {
    const result = await this.supplierRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }
  }
}
