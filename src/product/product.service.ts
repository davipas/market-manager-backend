import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationQueryDto } from 'src/common/dtos';

@Injectable()
export class ProductService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { search, limit = 10, page = 1 } = paginationQueryDto;
    const offset = (page - 1) * limit;

    const whereConditions = search
      ? [
          { name: ILike(`%${search.trim()}%`) },
          { barcode: search.trim() }, // Búsqueda exacta por código de barras
        ]
      : {};

    const [data, total] = await this.productRepository.findAndCount({
      where: whereConditions,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        category: true,
        supplier: true,
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
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const result = await this.productRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
}
