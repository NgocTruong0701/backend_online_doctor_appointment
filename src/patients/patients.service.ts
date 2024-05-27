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
import { DateHelper } from 'src/common/helper/date.helper';

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

  async findAll() {
    const result = await this.patientRepository.find({ relations: ['account'] });
    result.forEach(patient => {
      delete patient.account.password;
      delete patient.account.verificationCode;
      delete patient.account.verificationExpiry;
      delete patient.account.created_at;
      delete patient.account.updated_at;
      delete patient.account.patient;
    })
    return result
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

  async remove(id: number) {
    const patient = await this.patientRepository.findOne({ where: { id }, relations: ['account'] });
    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    const accountId = patient.account.id;
    await this.patientRepository.remove(patient);
    await this.userRepository.delete(accountId);
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

  async getFavoriteDoctor(payload: IPayload) {
    const patient = await this.patientRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.account', 'account')
      .where('account.id = :accountId', { accountId: payload.sub })
      .getOne();

    if (!patient) {
      return [];
    }

    const doctorsWithFeedback = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.feedbacks', 'feedback')
      .innerJoinAndSelect('doctor.specialization', 'specialization')
      .leftJoin('patient_doctor', 'pd', 'pd.doctor_id = doctor.id AND pd.patient_id = :patientId', { patientId: patient.id })
      .select([
        'doctor.*',
        'specialization.name AS specializationName',
        'specialization.id AS specializationId',
        'specialization.description AS specializationDescription',
        'specialization.icon AS specializationIcon',
        'AVG(feedback.rating) as averageRating',
        'COUNT(feedback.id) as feedbackCount',
        'CASE WHEN pd.patient_id IS NOT NULL THEN true ELSE false END as isFavorite'
      ])
      .groupBy('doctor.id')
      .addGroupBy('specialization.name')
      .addGroupBy('specialization.id')
      .addGroupBy('specialization.description')
      .addGroupBy('specialization.icon')
      .orderBy('averageRating', 'DESC')
      .getRawMany();

    const formattedDoctors = doctorsWithFeedback.map(doctor => ({
      ...doctor,
      averageRating: parseFloat(doctor.averageRating).toFixed(1),
      schedule: DateHelper.formatSchedule(
        doctor.start_day_of_week,
        doctor.time_start,
        doctor.end_day_of_week,
        doctor.time_end
      ),
    }));

    return formattedDoctors.filter(doctor => doctor.isFavorite);
  }
}
