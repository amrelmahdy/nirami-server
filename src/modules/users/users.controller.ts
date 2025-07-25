import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './schemas/user.schema';
// import { CreateUserDto } from './dtos/create-user.dto';
// import { EditUserDto } from './dtos/edit-user.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user-dto';
import { RolesGuard } from './guards/user-roles.guard';
import { Roles } from './guards/roles.decorator';
import { UpdateUserDto } from './dtos/update-user-dto';

@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }


    @Post()
    //@Roles(UserRole.ADMIN)
    async create(@Body() user: CreateUserDto): Promise<any> {
        return this.userService.create(user)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @Roles(UserRole.ADMIN)
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @Get(":id")
    async getUser(@Param("id") id: string): Promise<User> {
        return this.userService.findById(id);
    }

   
    @UseGuards(JwtAuthGuard)
    //@Roles(UserRole.ADMIN)
    @Put(":id")
    async updateUser(@Param("id") id: string, @Body() body: UpdateUserDto): Promise<User> {
        return this.userService.update(id, body);
    }



    // @UseGuards(JwtAuthGuard)
    // @Put(":id")
    // async updateUser(@Param("id") id: string, @Body() body: EditUserDto): Promise<User> {
    //     return this.userService.update(id, body);
    // }

    // @UseGuards(JwtAuthGuard)
    // @Delete(":id")
    // async deleteUser(@Param("id") id: string): Promise<User> {
    //     return this.userService.delete(id);
    // }


    // @UseGuards(JwtAuthGuard)
    // @Post("/user/wishlist")
    // async addTotWishList(@Request() req: any, @Body("productId") productId: string) {
    //     console.log(req.user)
    //     return this.userService.addTotWishList(req.user.username, productId)
    // }
}
