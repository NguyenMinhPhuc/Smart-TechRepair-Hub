import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../core/interfaces/repositories/user.repository.interface';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: any) => req?.cookies?.['access_token'] || req?.cookies?.['refresh_token'] || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'smart-repair-secret-key-32chars!!',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepo.findById(payload.sub);
    if (!user || user.isActive === false) throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa hoặc không tồn tại.');
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
