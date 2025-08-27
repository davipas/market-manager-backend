import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/, {
    message: 'Phone must contain only numbers and valid characters',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9\-\.\/\s]*$/, {
    message:
      'Identification can only contain letters, numbers, spaces and valid characters',
  })
  identification?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
