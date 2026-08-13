import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ example: 'Smart TechRepair Hub' })
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiProperty({ example: '123 Nguyễn Văn Cừ, Q.5, TP.HCM' })
  @IsString()
  @IsNotEmpty()
  storeAddress: string;

  @ApiProperty({ example: '1900-1234' })
  @IsString()
  @IsNotEmpty()
  storePhone: string;

  @ApiProperty({ example: 'hotline@smartrepair.vn' })
  @IsEmail({}, { message: 'Email cửa hàng không hợp lệ.' })
  storeEmail: string;

  @ApiPropertyOptional({ example: '/images/logo.png' })
  @IsOptional()
  @IsString()
  storeLogoUrl?: string;

  @ApiPropertyOptional({ example: '0312345678' })
  @IsOptional()
  @IsString()
  taxCode?: string;

  @ApiPropertyOptional({ example: 'Cảm ơn quý khách đã tin tưởng dịch vụ!' })
  @IsOptional()
  @IsString()
  receiptFooterNote?: string;
}

export class ResetSystemDataDto {
  @ApiProperty({ example: 'Admin@123456' })
  @IsString()
  @IsNotEmpty()
  adminPassword: string;
}
