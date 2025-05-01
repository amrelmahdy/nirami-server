import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`
    })
  }

  async validate(payload: any) {
    return {
      userId: payload.userId, 
      user: payload.sub, 
      username: payload.username
    }
  }
}