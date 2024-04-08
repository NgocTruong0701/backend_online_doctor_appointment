import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Patient } from 'src/patients/entities/patient.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Patient)
    public patientRepository: Repository<Patient>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<Patient> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const account = new User();
    account.email = createUserDto.email;
    account.password = createUserDto.password;
    account.role = createUserDto.role;
    await this.userRepository.save(account);

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
    return patient;
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
