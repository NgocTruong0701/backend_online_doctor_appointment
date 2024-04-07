import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ) { }

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.userService.findOne(loginDto);

        const passwordMatched = await bcrypt.compare(loginDto.password, user.password);
        if (passwordMatched) {
            delete user.password;

            const payload = { sub: user.id, email: user.email, roles: user.role };
            return {
                access_token: await this.jwtService.signAsync(payload),
            }
        }
        throw new UnauthorizedException("Password does not match");
    }
}
