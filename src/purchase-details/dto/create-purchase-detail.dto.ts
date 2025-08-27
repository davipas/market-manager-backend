import { IsUUID, IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class CreatePurchaseDetailDto {
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
}
