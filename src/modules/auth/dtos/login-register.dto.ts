import { IsNotEmpty, IsString } from "class-validator";


export class LoginRegisterWithOtpDto {
    @IsString()
    @IsNotEmpty()
    phoneOrEmail: string;
    
}
