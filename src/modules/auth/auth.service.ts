import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/schemas/user.schema';
import { UsersService } from 'src/modules/users/users.service';
import { CacheService } from '../cache/cache.service';

const bcryptjs = require('bcryptjs')

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private cacheService: CacheService
    ) { }


    async login(user: User) {
        const now = Date.now();
        const userId = (user as any)._id?.toString();

        const payload = {
            userId,
            username: user.email,
            sub: {
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
            },
        };

        const accessTokenExpiry = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10); // default: 1 day
        const refreshTokenExpiry = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800', 10); // default: 7 days

        const accessTokenExpiresAt = now + accessTokenExpiry * 1000;
        const refreshTokenExpiresAt = now + refreshTokenExpiry * 1000;


        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: accessTokenExpiry }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: refreshTokenExpiry }),
            tokenType: "Bearer",
            expiresIn: accessTokenExpiry.toString(),
            expiresAt: accessTokenExpiresAt.toString(),
            refreshExpiresIn: refreshTokenExpiry.toString(),
            refreshExpiresAt: refreshTokenExpiresAt.toString(),
            userInfo: user,
        };
    }



    async register(body: User): Promise<any> {
        // const now = Date.now()
        // const { email, phone, password } = body;
        // const userIsTaken = await this.usersService.findByEmailOrPhone(email, phone)
        // if (userIsTaken) {
        //     throw new BadRequestException("User has already been taken.")
        // }
        // const salt = await bcryptjs.genSalt(10);

        // const hash = await bcryptjs.hash(password, salt)

        // body.password = hash;

        // const user = await this.usersService.create(body);


        // const userId = (user as any).id

        // const payload = {
        //     userId: userId,
        //     username: user.email || user.phone,
        //     sub: {
        //         first_name: user.first_name,
        //         last_name: user.last_name,
        //         phone: user.phone,
        //         email: user.email
        //     }
        // };
        // // Calculate expiration time for access token (1 day)
        // const accessTokenExpiresAt = now + (86400 * 1000); // 86400 seconds * 1000 milliseconds/second
        // // Calculate expiration time for refresh token (7 days)
        // const refreshTokenExpiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second

        // return {
        //     access_token: this.jwtService.sign(payload, { expiresIn: '86400s' }),
        //     refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        //     token_type: "Bearer",
        //     expires_in: "86400",
        //     expires_at: `${accessTokenExpiresAt}`,
        //     refresh_expires_in: "604800",
        //     refresh_expires_at: `${refreshTokenExpiresAt}`,
        //     userInfo: user
        // }
    }

    refreshToken(currentUser: any): any {
        const now = Date.now()
        // Calculate expiration time for access token (1 day)
        const accessTokenExpiresAt = now + (86400 * 1000); // 86400 seconds * 1000 milliseconds/second
        const payload = {
            userId: currentUser.userId,
            username: currentUser.username,
            sub: {
                name: currentUser.user.name,
                phone: currentUser.user.phone
            }
        };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '86400s' }),
            expires_in: "86400",
            expires_at: `${accessTokenExpiresAt}`,
        }
    }

    async getCurrentUser(user: any): Promise<User> {
        const { userId } = user
        const currentUser = await this.usersService.findById(userId);
        return currentUser
    }

    async decodeToken(token: string) {
        const decodedToken = this.jwtService.decode(token);
        return decodedToken
    }


    async generateOtp(emailOrPhone: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const key = `otp:${emailOrPhone}`;

        await this.cacheService.setValue(key, otp, 300); // expires in 5 minutes

        return otp;
    }


    async sendOtp(emailOrPhone: string): Promise<any> {

        const lockKey = `otp:${emailOrPhone}`;
        const isLocked = await this.cacheService.getValue(lockKey);

        // if (isLocked) {
        //     throw new BadRequestException('Please wait before requesting a new OTP');
        // }

        const otp = await this.generateOtp(emailOrPhone);
        // TODO: send otp via email or phone 
        return {
            success: true,
            otp,
            message: 'OTP sent successfully',
        };
    }


    async verifyOtp(emailOrPhone: string, otp: string): Promise<{ success: boolean; message: string }> {


        const key = `otp:${emailOrPhone}`;
        const storedOtp = await this.cacheService.getValue(key);


        if (!storedOtp) {
            return {
                success: false,
                message: 'OTP has expired or was not requested',
            };
        }

        if (storedOtp.toString() !== otp) {
            return {
                success: false,
                message: 'Invalid OTP',
            };
        }

        // Valid OTP — delete from Redis to enforce one-time use
        //await this.cacheService.deleteValue(key);

        return {
            success: true,
            message: 'OTP verified successfully',
        };
    }


    async loginWithOtp(user: User) {
        console.log("user", user)
    }


    async validateUser(username: string, password: string): Promise<Partial<User> | null> {
        const user = await this.usersService.findByEmailOrPhone(username, username);
        if (!user) return null;

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) return null;

        const { password: _, __v, ...safeUser } = (user as any).toObject() ?? user;
        return safeUser;
    }


}
