import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/, {
    message:
      'Phone must contain only numbers and valid characters (+12345678900)',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
