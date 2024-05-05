import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) { }
  create(createPatientDto: CreatePatientDto) {
    return 'This action adds a new patient';
  }

  findAll() {
    return `This action returns all patients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  async getProfile(payload: any) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('This profile does not exist');
    }
    delete user.password;
    const patient = await this.patientRepository.findOne({
      where: { account: user },
      relations: {
        account: true
      }
    });
    delete patient.account.password;
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<UpdateResult> {
    return await this.patientRepository.update(id, updatePatientDto);
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
