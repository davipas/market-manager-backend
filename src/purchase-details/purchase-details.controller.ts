import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PurchaseDetailsService } from './purchase-details.service';
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase-detail.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('purchase-details')
export class PurchaseDetailsController {
  constructor(
    private readonly purchaseDetailsService: PurchaseDetailsService,
  ) {}

  @Post()
  create(@Body() createPurchaseDetailDto: CreatePurchaseDetailDto) {
    return this.purchaseDetailsService.create(createPurchaseDetailDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.purchaseDetailsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchaseDetailsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePurchaseDetailDto: UpdatePurchaseDetailDto,
  ) {
    return this.purchaseDetailsService.update(id, updatePurchaseDetailDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchaseDetailsService.remove(id);
  }
}
