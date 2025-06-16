import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const { phoneOrEmail, otp } = (req as any).body;

    if (!phoneOrEmail || !otp) {
      throw new UnauthorizedException('phone or email and OTP are required');
    }

    const verification = await this.authService.verifyOtp(phoneOrEmail, otp);

    if (!verification.success) {
      throw new UnauthorizedException(verification.message);
    }

    const user = await this.usersService.findByEmailOrPhone(phoneOrEmail, phoneOrEmail);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
