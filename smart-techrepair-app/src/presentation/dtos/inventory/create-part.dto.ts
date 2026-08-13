import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'Màn hình Samsung Galaxy S21' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'IMEI-123456789' })
  @IsString()
  @IsNotEmpty()
  serialIMEI: string;

  @ApiProperty({ example: 850000 })
  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Màn hình' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
