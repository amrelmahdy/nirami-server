import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class OtpVerificationService {

    constructor(private cacheService: CacheService) { }

    async generateOtp(userId: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const key = `otp:${userId}`;

        await this.cacheService.setValue(key, otp, 300); // expires in 5 minutes

        return otp;
    }


    async verifyOtp(userId: string, otp: string): Promise<boolean> {
        const key = `otp:${userId}`;
        const storedOtp = await this.cacheService.getValue(key);

        if (storedOtp === otp) {
            await this.cacheService.deleteValue(key); // One-time use
            return true;
        }
        return false;
    }
}
