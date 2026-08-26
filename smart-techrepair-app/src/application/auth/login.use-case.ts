import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../core/domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../core/interfaces/repositories/user.repository.interface';
import { Inject } from '@nestjs/common';

export interface LoginResult {
  accessToken: string;
  user: {
    userId: string;
    username: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    if (user.isActive === false) throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa.');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');

    const payload = { sub: user.userId, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: { userId: user.userId, username: user.username, email: user.email, role: user.role },
    };
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || user.isActive === false) return null;
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    return isMatch ? user : null;
  }
}
