import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../core/domain/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'technician2' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'ktv2@smartrepair.vn' })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email: string;

  @ApiProperty({ example: 'Admin@123456' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu ít nhất 8 ký tự.' })
  password: string;

  @ApiProperty({ enum: Role, example: Role.TECHNICIAN })
  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'technician2' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'ktv2@smartrepair.vn' })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email: string;

  @ApiPropertyOptional({ example: 'NewPass@123' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
  @IsString()
  @MinLength(8, { message: 'Mật khẩu ít nhất 8 ký tự.' })
  password?: string;

  @ApiProperty({ enum: Role, example: Role.TECHNICIAN })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class DeleteUserDto {
  @ApiProperty({ example: 'Admin@123456' })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu Admin để xác nhận xóa.' })
  adminPassword: string;
}

export class ToggleUserStatusDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}
