import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  barcode?: string;
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  //Relations
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;
}
