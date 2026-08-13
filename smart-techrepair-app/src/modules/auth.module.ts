import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../infrastructure/database/typeorm/entities/user.orm-entity';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import { SpCallerService } from '../infrastructure/database/sp-caller.service';
import { USER_REPOSITORY } from '../core/interfaces/repositories/user.repository.interface';
import { JwtStrategy } from '../infrastructure/auth/jwt.strategy';
import { LocalStrategy } from '../infrastructure/auth/local.strategy';
import { LoginUseCase } from '../application/auth/login.use-case';
import { AuthController } from '../presentation/api/auth.controller';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'smart-repair-secret-key-32chars!!',
        signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '15m') as any },
      }),
    }),
  ],
  providers: [
    SpCallerService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    UserRepository,
    JwtStrategy,
    LocalStrategy,
    LoginUseCase,
  ],
  controllers: [AuthController],
  exports: [LoginUseCase, JwtModule, USER_REPOSITORY, UserRepository],
})
export class AuthModule {}
