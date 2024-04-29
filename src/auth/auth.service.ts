import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { VerifyEmailDto } from './dto/verifyemail.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { OAuth2Client } from 'google-auth-library';
import { Role } from 'src/common/enum/roles.enum';
import { Patient } from 'src/patients/entities/patient.entity';

export interface IPayload {
    sub: number,
    email: string, 
    role: string
}
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>
    ) { }

    private client = new OAuth2Client();

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.userService.findOne(loginDto);

        const passwordMatched = await bcrypt.compare(loginDto.password, user.password);
        if (passwordMatched) {
            if (user.verified === false) {
                throw new UnauthorizedException("Account not verified");
            }
            delete user.password;

            const payload = { sub: user.id, email: user.email, role: user.role, };
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

    async loginGoogle(loginGoogleDto) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: loginGoogleDto.token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            const { email, name, picture } = payload;

            const userInDb = await this.userRepository.findOneBy({
                email: email,
            });

            if (userInDb && userInDb.verified === true) {
                return this.login({ email: email, password: email } as LoginDto);
            }

            const salt = await bcrypt.genSalt();
            const password = await bcrypt.hash(email, salt);

            const account = new User();
            account.email = email;
            account.password = password;
            account.role = Role.PATIENT;
            account.verified = true;
            await this.userRepository.save(account);

            const patient = new Patient();
            patient.name = name;
            patient.avatar = picture;
            patient.account = account;

            await this.patientRepository.save(patient);
            delete account.password;

            const payload_token = { sub: account.id, email: account.email, role: account.role, } as IPayload;
            return {
                access_token: await this.jwtService.signAsync(payload_token),
            }
        } catch (err) {
            console.error('Error verifying Google ID token:', err.message);
            // Optionally log the entire error object (e.g., console.error(err));
            throw err.message; // Re-throw the error to propagate it upwards
        }
    }
}
