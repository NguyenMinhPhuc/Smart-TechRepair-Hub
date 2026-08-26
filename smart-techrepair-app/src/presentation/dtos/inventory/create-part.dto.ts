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

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Màn hình' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePartDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Màn hình Samsung Galaxy S21' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'IMEI-123456789' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  serialIMEI?: string;

  @ApiPropertyOptional({ example: 850000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ example: 'New' })
  @IsOptional()
  @IsString()
  status?: string;
}
