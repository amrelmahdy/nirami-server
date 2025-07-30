import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/schemas/user.schema';
import { UsersService } from 'src/modules/users/users.service';
import { CacheService } from '../cache/cache.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const bcryptjs = require('bcryptjs')

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private cacheService: CacheService,
        private readonly httpService: HttpService
    ) { }


    async login(user: User) {
        const now = Date.now();
        const userId = (user as any)._id?.toString();

        const payload = {
            userId,
            username: user.email,
            sub: {
                firstName: user.firstName,
                lastName: user.lastName,
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


    async logout(user: User) {
        console.log("Logging out user:", user);
    }

    async loginWithOtp(body: { phoneOrEmail: string }) {

        const now = Date.now()
        const { phoneOrEmail } = body;

        const userExists = await this.usersService.findByEmailOrPhone(phoneOrEmail, phoneOrEmail);
        let user: User;

        if (userExists) { // login with existing user 
            user = userExists;
        } else { // register new user
            // Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Saudi phone: starts with 05, 5, or +9665, and 8 digits after
            const saPhoneRegex = /^(?:\+9665|05|5)[0-9]{8}$/;

            const isEmail = emailRegex.test(phoneOrEmail);
            const isPhone = saPhoneRegex.test(phoneOrEmail);

            const email = isEmail ? phoneOrEmail : null;
            const phone = isPhone ? phoneOrEmail : null;

            if (!isEmail && !isPhone) {
                throw new BadRequestException("Input must be a valid email or Saudi phone number.");
            }

            const newUser: any = {}

            if (email) newUser.email = email.toLowerCase().trim();
            if (phone) newUser.phone = phone.trim();

            user = await this.usersService.register(newUser);
        }

        const userId = (user as any)._id

        const payload = {
            userId: userId,
            username: user.email || user.phone,
            sub: {
                firstNname: user.firstName,
                lastNname: user.lastName,
                phone: user.phone,
                email: user.email
            }
        };
        // Calculate expiration time for access token (1 day)
        const accessTokenExpiresAt = now + (86400 * 1000); // 86400 seconds * 1000 milliseconds/second
        // Calculate expiration time for refresh token (7 days)
        const refreshTokenExpiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second

        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: '86400s' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
            tokenType: "Bearer",
            expiresIn: "86400",
            expiresAt: `${accessTokenExpiresAt}`,
            refreshExpiresIn: "604800",
            refreshExpiresAt: `${refreshTokenExpiresAt}`,
            userInfo: user
        }
    }




    // async register(body: { phoneOrEmail: string }): Promise<any> {
    //     const now = Date.now()
    //     const { phoneOrEmail } = body;
    //     console.log("phoneOrEmailphoneOrEmailphoneOrEmailphoneOrEmail", phoneOrEmail)

    //     const userIsTaken = await this.usersService.findByEmailOrPhone(phoneOrEmail, phoneOrEmail)
    //     if (userIsTaken) {
    //         throw new BadRequestException("User has already been taken.")
    //     }

    //     // Validation
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     // Saudi phone: starts with 05, 5, or +9665, and 8 digits after
    //     const saPhoneRegex = /^(?:\+9665|05|5)[0-9]{8}$/;

    //     const isEmail = emailRegex.test(phoneOrEmail);
    //     const isPhone = saPhoneRegex.test(phoneOrEmail);

    //     const email = isEmail ? phoneOrEmail : null;
    //     const phone = isPhone ? phoneOrEmail : null;

    //     if (!isEmail && !isPhone) {
    //         throw new BadRequestException("Input must be a valid email or Saudi phone number.");
    //     }

    //     const newUser: any = {}

    //     if (email) newUser.email = email.toLowerCase().trim();
    //     if (phone) newUser.phone = phone.trim();


    //     const user = await this.usersService.register(newUser);

    //     const userId = (user as any).id

    //     const payload = {
    //         userId: userId,
    //         username: user.email || user.phone,
    //         sub: {
    //             firstNname: user.firstName,
    //             lastNname: user.lastName,
    //             phone: user.phone,
    //             email: user.email
    //         }
    //     };
    //     // Calculate expiration time for access token (1 day)
    //     const accessTokenExpiresAt = now + (86400 * 1000); // 86400 seconds * 1000 milliseconds/second
    //     // Calculate expiration time for refresh token (7 days)
    //     const refreshTokenExpiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second

    //     return {
    //         accessToken: this.jwtService.sign(payload, { expiresIn: '86400s' }),
    //         refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    //         tokenType: "Bearer",
    //         expiresIn: "86400",
    //         expiresAt: `${accessTokenExpiresAt}`,
    //         refreshExpiresIn: "604800",
    //         refreshExpiresAt: `${refreshTokenExpiresAt}`,
    //         userInfo: user
    //     }
    // }

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
            accessToken: this.jwtService.sign(payload, { expiresIn: '86400s' }),
            expiresIn: "86400",
            expiresAt: `${accessTokenExpiresAt}`,
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


    async sendOtp(body: { phoneOrEmail: string }): Promise<any> {
        const { phoneOrEmail } = body
        try {
            const otpResponse = await firstValueFrom(
                this.httpService.post('https://www.msegat.com/gw/sendOTPCode.php', {
                    lang: 'En',
                    userName: 'Sultanqd1011',
                    number: phoneOrEmail, // Use the input here if dynamic
                    userSender: 'Nirami',
                    apiKey: 'E71453A252F15D98BD8907E0B9FC9042',
                }),
            );

            return otpResponse.data;
        } catch (error) {
            throw new InternalServerErrorException('Failed to send OTP');
        }
        // const otp = await this.httpService.post('https://www.msegat.com/gw/sendOTPCode.php',
        //     {
        //         "lang": "En",
        //         "userName": "Sultanqd1011",
        //         "number": "101003939110",
        //         "userSender": "Nirami",
        //         "apiKey": "E71453A252F15D98BD8907E0B9FC9042"

        //     }
        // );

        // console.log("otp", otp);

        //const user = await this.usersService.findByEmailOrPhone(phoneOrEmail, phoneOrEmail);

        // if (!user) {
        //     throw new BadRequestException({ code: 'user_not_found', message: 'User not found' });
        // }

        // const lockKey = `otp:${phoneOrEmail}`;
        // const isLocked = await this.cacheService.getValue(lockKey);

        // if (isLocked) {
        //     throw new BadRequestException('Please wait before requesting a new OTP');
        // }

        // const otp = await this.generateOtp(phoneOrEmail);
        // // TODO: send otp via email or phone 
        // return {
        //     success: true,
        //     otp,
        //     message: 'OTP sent successfully',
        // };
    }


    async verifyOtp(otpId, code): Promise<{
        "code": string,
        "message": string,
        "result": string | null
    }> {
        try {
            const verifyOtpResponse = await firstValueFrom(
                this.httpService.post(' https://www.msegat.com/gw/verifyOTPCode.php',
                    {
                        "lang": "En",
                        "userName": "Sultanqd1011",
                        "userSender": "Nirami",
                        "apiKey": "E71453A252F15D98BD8907E0B9FC9042",
                        "code": code,
                        "id": otpId
                    }
                ),
            );
            return verifyOtpResponse.data;
        } catch (error) {
            throw new InternalServerErrorException('Failed to send OTP');
        }
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
