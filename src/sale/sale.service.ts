import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { In, Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createSaleDto: CreateSaleDto) {
    // 1. Validate if products exist and if they are in stock
    const productsIds = createSaleDto.details.map((detail) => detail.productId);
    const products = await this.productRepository.find({
      where: { id: In(productsIds) },
    });
    //verify if products exist
    if (products.length !== productsIds.length) {
      throw new NotFoundException(
        `Some products with ids ${productsIds} not found`,
      );
    }
    // verify if products are in stock
    const stocktErrors: string[] = [];
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );
    for (const detail of createSaleDto.details) {
      const product = productMap.get(detail.productId);
      if (product!.stock < detail.quantity) {
        stocktErrors.push(`Product ${product!.name} is out of stock`);
      }
    }
    if (stocktErrors.length > 0) {
      throw new BadRequestException(stocktErrors);
    }
    // 2. Validate total
    const calculatedTotal = createSaleDto.details.reduce(
      (acc, detail) => acc + detail.subtotal,
      0,
    );
    const epsilon = 0.01;
    if (Math.abs(calculatedTotal - createSaleDto.total) > epsilon) {
      throw new BadRequestException(
        `Total (${createSaleDto.total}) is not equal to subtotal (${calculatedTotal})`,
      );
    }
    //3. Validate subtotal of each detail
    for (const detail of createSaleDto.details) {
      const calculatedSubtotal = detail.quantity * detail.unitPrice;
      if (detail.discount) {
        const discountedSubtotal =
          calculatedSubtotal * (1 - detail.discount / 100);
        if (Math.abs(discountedSubtotal - detail.subtotal) > epsilon) {
          throw new BadRequestException(
            `Product with id ${detail.productId} subtotal does not match quantity × price - discount`,
          );
        }
      } else {
        if (Math.abs(calculatedSubtotal - detail.subtotal) > epsilon) {
          throw new BadRequestException(
            `Product with id ${detail.productId} subtotal does not match quantity × price`,
          );
        }
      }
    }
    //4. Create sale
    try {
      const sale = this.saleRepository.create(createSaleDto);
      const savedSale = await this.saleRepository.save(sale);
      // 5 Update products stock
      const updatePromises = createSaleDto.details.map(async (detail) => {
        const product = productMap.get(detail.productId);
        return this.productRepository.update(detail.productId, {
          stock: product!.stock - detail.quantity,
        });
      });
      await Promise.all(updatePromises);
      //6 Return sale with updated details
      //todo: check which relations are needed
      return await this.saleRepository.findOne({ where: { id: savedSale.id } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la venta');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.saleRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const sale = await this.saleRepository.findOne({ where: { id } });
    if (!sale) {
      throw new NotFoundException(`Sale with id ${id} not found`);
    }
    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const sale = await this.saleRepository.preload({
      id,
      ...updateSaleDto,
    });
    if (!sale) {
      throw new NotFoundException(`Sale with id ${id} not found`);
    }
    return await this.saleRepository.save(sale);
  }

  async remove(id: string) {
    const result = await this.saleRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Sale with id ${id} not found`);
    }
  }
}
