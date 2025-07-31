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
    const { otpId, code } = (req as any).body;

    if (!otpId || !code) {
      throw new UnauthorizedException('phone or email and OTP are required');
    }

    // const verification = await this.authService.verifyOtp(otpId, code);

    // if (verification.message !== "Success") {
    //   throw new UnauthorizedException(verification.message);
    // }
    return true;
  }
}
