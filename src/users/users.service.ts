import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Patient } from 'src/patients/entities/patient.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from 'src/common/enum/roles.enum';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Specialization } from 'src/specializations/entities/specialization.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private mailerService: MailerService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    const userInDb = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    // Generate verification code and expiry date
    const verificationCode = this.generateVerificationCode();
    const verificationExpiry = this.generateVerificationExpiry();

    if (userInDb && userInDb.verified === true) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    else if (userInDb && userInDb.verified === false) {
      userInDb.verificationCode = verificationCode;
      userInDb.verificationExpiry = verificationExpiry;
      await this.userRepository.update({ id: userInDb.id }, userInDb);
      this.sentMailCode(createUserDto.email, createUserDto.name, verificationCode);
      return false;
    }

    try {
      const salt = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

      const account = new User();
      account.email = createUserDto.email;
      account.password = createUserDto.password;
      account.role = createUserDto.role;
      account.verificationCode = verificationCode;
      account.verificationExpiry = verificationExpiry;
      await this.userRepository.save(account);

      if (createUserDto.role === Role.PATIENT) {
        const patient = new Patient();
        patient.name = createUserDto.name;
        patient.address = createUserDto.address;
        patient.avatar = createUserDto.avatar;
        patient.date_of_birth = createUserDto.date_of_birth;
        patient.gender = createUserDto.gender;
        patient.phone_number = createUserDto.phone_number;
        patient.account = account;

        await this.patientRepository.save(patient);
        delete account.password;
      }
      else if (createUserDto.role === Role.DOCTOR){
        const doctor = new Doctor();
        const specialization = await this.specializationRepository.findOneBy({id: createUserDto.specializationId});

        doctor.specialization = specialization;
        doctor.name = createUserDto.name;
        doctor.phone_number = createUserDto.phone_number;
        doctor.account = account;
        doctor.address = createUserDto.address;
        doctor.avatar = createUserDto.avatar;
        doctor.date_of_birth = createUserDto.date_of_birth;
        doctor.gender = createUserDto.gender;

        await this.doctorRepository.save(doctor);
        delete account.password;
      }

      this.sentMailCode(createUserDto.email, createUserDto.name, verificationCode);
      return true;
    }
    catch (error) {
      throw new HttpException('Have a some error, please contact with admin to fix', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private generateVerificationCode(): string {
    // Generate a random 6-digit numeric code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateVerificationExpiry(): Date {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15); // Add 15 minutes to current time
    return expiryDate;
  }

  private async sentMailCode(email: string, name: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to my website',
      template: './verifyemail',
      context: {
        name: name,
        verificationCode: code,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Could not find account');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
