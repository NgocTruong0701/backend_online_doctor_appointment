import { IPayload } from './../auth/auth.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { FavoriteDoctorDto } from './dto/favorite-doctor.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
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

  async getDoctorFavorite(payload: IPayload): Promise<Doctor[]> {
    const account = await this.userRepository.findOneBy({ id: payload.sub });
    const { patient } = account;
    const doctorFavorite = await this.patientRepository.findOne({
      where: {
        id: patient.id
      },
      relations: {
        doctors: true
      }
    });

    return doctorFavorite.doctors;
  }

  async favoriteDoctor(favoriteDoctorDto: FavoriteDoctorDto) {
    const patient = await this.patientRepository.findOne({
      where: { id: favoriteDoctorDto.patientId },
      relations: ['doctors'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found')
    }

    const doctorFavorte = await this.doctorRepository.findOneBy({ id: favoriteDoctorDto.doctorId });

    if (!doctorFavorte) {
      throw new NotFoundException('Doctor not found')
    }

    const index = patient.doctors.findIndex(doctor => doctor.id === doctorFavorte.id);

    if (index !== -1) {
      patient.doctors.splice(index, 1);
      await this.patientRepository.save(patient);
    } else {
      patient.doctors.push(doctorFavorte);
      await this.patientRepository.save(patient);
    }

    return true;
  }
}
