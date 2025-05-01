import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/modules/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenJwtAuthGuard } from './guards/refresh-token-jwt-auth.guard';
import { CreateUserDto } from '../users/dtos/create-user-dto';
import { SendOtpDto } from './dtos/send-otp-dto';
import { VerifyOtpDto } from './dtos/verify-otp-dto';
import { OtpAuthGuard } from './guards/otp-auth-guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req: any): Promise<any> {
        return this.authService.login(req.user)
    }

    @Post("register")
    async register(@Body() user: CreateUserDto): Promise<any> {
        return this.authService.register(user)
    }


    @UseGuards(JwtAuthGuard)
    @Get("user")
    async getUser(@Request() req: any): Promise<User> {
        return this.authService.getCurrentUser(req.user);
    }

    @UseGuards(RefreshTokenJwtAuthGuard)
    @Post("refresh")
    async refreshToken(@Request() req: any): Promise<any> {
        return this.authService.refreshToken(req.user);
    }


    @UseGuards(JwtAuthGuard)
    @Post("decode")
    async decodeToken(@Body("token") token: string) {
        return this.authService.decodeToken(token);
    }

    @Post('send-otp')
    async sendOtp(@Body() body: SendOtpDto) {
        return this.authService.sendOtp(body.emailOrPhone);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: VerifyOtpDto) {
        return this.authService.verifyOtp(body.emailOrPhone, body.otp);
    }


    @Post('otp-login')
    @UseGuards(OtpAuthGuard)
    async loginWithOtp(@Request() req) {
        return this.authService.loginWithOtp(req.user); // Returns JWT or session token
    }
}
