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
    const { emailOrPhone, otp } = (req as any).body;

    if (!emailOrPhone || !otp) {
      throw new UnauthorizedException('emailOrPhone and OTP are required');
    }

    const verification = await this.authService.verifyOtp(emailOrPhone, otp);

    if (!verification.success) {
      throw new UnauthorizedException(verification.message);
    }

    const user = await this.usersService.findByEmailOrPhone(emailOrPhone, emailOrPhone);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
