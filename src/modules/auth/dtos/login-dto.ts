export class LoginWithPasswordDto {
    email: string;
    password: string;
}

export class LoginWithOtpDto {
    phone: string;
    otp: string;
}

export class RequestOtpDto {
    phone: string;
}