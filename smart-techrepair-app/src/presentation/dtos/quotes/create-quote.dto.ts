import { IsNumber, IsOptional, IsString, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuoteDto {
  @ApiProperty({ example: 150000 })
  @IsNumber()
  @IsPositive()
  totalLaborCost: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddPartDto {
  @ApiProperty({ example: 'uuid-of-part' })
  @IsString()
  partId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class QuoteDecisionDto {
  @ApiProperty({ example: '0912345678' })
  @IsString()
  phone: string;
}
