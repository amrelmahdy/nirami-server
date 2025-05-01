import { Module } from '@nestjs/common';
import { OtpVerificationController } from './otp-verification.controller';
import { OtpVerificationService } from './otp-verification.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [OtpVerificationController],
  providers: [OtpVerificationService]
})
export class OtpVerificationModule {}
