import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { VerifyEmailDto } from './dto/verifyemail.dto';
import { ResponseData } from 'src/common/global/responde.data';
import { HttpMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { LoginGoogleDto } from './dto/login-google.dto';

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
                return new ResponseData<string>('Create user successfully', HttpStatusCode.CREATED, HttpMessage.CREATED);
            }
            return new ResponseData<string>('Verification code has been resent', HttpStatusCode.OK, HttpMessage.OK);
        } catch (error) {
            return new ResponseData<string>(error, HttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR);
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
    async verifyCode(@Body() verifyEmailDto: VerifyEmailDto) {
        try {
            const result = await this.authService.verifyCode(verifyEmailDto);
            if (result) {
                return new ResponseData<string>('Email has been verified', HttpStatusCode.OK, HttpMessage.OK);
            }
        } catch (error) {
            return new ResponseData<string>('Server error', HttpStatusCode.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Post('login-google')
    @Public()
    async loginGoogle(@Body() loginGoogleDto: LoginGoogleDto): Promise<{ access_token: string }> {
        try {
            return await this.authService.loginGoogle(loginGoogleDto);
        } catch (error) {
            throw new HttpException(JSON.stringify(error, null, 2), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
