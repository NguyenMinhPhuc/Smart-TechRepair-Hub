import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '0912345678' })
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Số điện thoại phải đúng 10 chữ số.' })
  phone: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @ApiPropertyOptional({ example: 'khachhang@gmail.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email?: string;

  @ApiProperty({ example: 'Màn hình bị vỡ, không nhận sạc' })
  @IsString()
  @IsNotEmpty({ message: 'Mô tả lỗi không được để trống.' })
  issueDescription: string;
}
