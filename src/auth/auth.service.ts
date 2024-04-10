import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { VerifyEmailDto } from './dto/verifyemail.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.userService.findOne(loginDto);

        const passwordMatched = await bcrypt.compare(loginDto.password, user.password);
        if (passwordMatched) {
            if (user.verified === false) {
                throw new UnauthorizedException("Account not verified");
            }
            delete user.password;

            const payload = { sub: user.id, email: user.email, role: user.role,  };
            return {
                access_token: await this.jwtService.signAsync(payload),
            }
        }
        throw new UnauthorizedException("Password does not match");
    }

    async verifyCode(verifyEmailDto: VerifyEmailDto): Promise<boolean> {
        const user = await this.userRepository.findOneBy({ email: verifyEmailDto.email });
        if (!user) {
            // Handle case when user with provided email doesn't exist
            throw new NotFoundException("User with provided email does not exist");
        }

        if (user.verified) {
            throw new ConflictException("Email is already verified");
        }

        // Check if verification code matches and not expired
        if (user.verificationExpiry && user.verificationCode === verifyEmailDto.code && user.verificationExpiry > new Date()) {
            await this.userRepository.update({ id: user.id }, { verified: true, verificationCode: null, verificationExpiry: null });
            return true;
        }

        throw new BadRequestException("Verification code has expired");
    }
}
