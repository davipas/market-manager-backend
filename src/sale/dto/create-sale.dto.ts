import { Type } from 'class-transformer';
import {
  IsUUID,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsIn,
  IsPositive,
  Min,
} from 'class-validator';
import { CreateSaleDetailDto } from 'src/sale-details/dto/create-sale-detail.dto';
export class CreateSaleDto {
  //   @IsUUID()
  //   userId: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNumber()
  @Min(0, { message: 'total must be greater than 0' })
  total: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsIn(['completed', 'cancelled', 'pending'])
  status?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  details: CreateSaleDetailDto[];
}
