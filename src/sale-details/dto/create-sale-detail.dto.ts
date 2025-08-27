import {
  IsUUID,
  IsInt,
  IsNumber,
  IsPositive,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateSaleDetailDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(0, { message: 'quantity must be greater than 0' })
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'unitPrice must be greater than 0' })
  unitPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'subtotal must be greater than 0' })
  subtotal: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'discount must be greater than 0' })
  @Max(100, { message: 'discount must be less than 100' })
  discount?: number;
}
