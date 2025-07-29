import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenJwtStrategy } from './strategies/refresh-token-jwt.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { OtpStrategy } from './strategies/otp.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        UsersModule,
        HttpModule,
        CacheModule,
        PassportModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: '86400s' },
            };
          },
        })
      ],    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenJwtStrategy, OtpStrategy],
})
export class AuthModule {}
