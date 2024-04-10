import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { VerifyEmailDto } from './dto/verifyemail.dto';
import { ResponseData } from 'src/common/global/responde.data';
import { HtppMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) { }

    @Post('signup')
    @Public()
    async signup(@Body() createUserDto: CreateUserDto): Promise<ResponseData<string>> {
        try {
            const reuslt = await this.userService.create(createUserDto);
            if (reuslt) {
                return new ResponseData<string>('Create user successfully', HttpStatusCode.CREATED, HtppMessage.CREATED);
            }
            return new ResponseData<string>('Verification code has been resent', HttpStatusCode.OK, HtppMessage.OK);
        } catch (error) {
            return new ResponseData<string>(error, HttpStatus.INTERNAL_SERVER_ERROR, HtppMessage.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    @Public()
    login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
        try {
            return this.authService.login(loginDto)
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('verify-email')
    @Public()
    async verifyCode(@Body() verifyEmailDto: VerifyEmailDto, @Res() response) {
        const reuslt = await this.authService.verifyCode(verifyEmailDto)
        if (reuslt) {
            return new ResponseData<string>('Email has been verified', HttpStatusCode.OK, HtppMessage.OK);
        }
    }
}
