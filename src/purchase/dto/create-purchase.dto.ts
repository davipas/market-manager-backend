import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreatePurchaseDetailDto } from 'src/purchase-details/dto/create-purchase-detail.dto';

export class CreatePurchaseDto {
  @IsUUID()
  supplierId: string;

  //   @IsUUID()
  //   userId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0, { message: 'total must be greater than 0' })
  total: number;

  @IsDateString()
  @IsOptional()
  date: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseDetailDto)
  details: CreatePurchaseDetailDto[];
}
