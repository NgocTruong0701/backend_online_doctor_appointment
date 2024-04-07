import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @Post('signup')
    @Public()
    async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.create(createUserDto);
    }

    @Post('login')
    @Public()
    login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
        return this.authService.login(loginDto)
    }
}
