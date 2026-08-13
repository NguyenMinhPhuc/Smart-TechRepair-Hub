import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@smartrepair.vn' })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email: string;

  @ApiProperty({ example: 'Admin@123456' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự.' })
  password: string;
}
