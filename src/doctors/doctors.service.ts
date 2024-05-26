import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';
import { DateHelper } from 'src/common/helper/date.helper';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { AppointmentStatus } from 'src/common/enum/appointment.status.enum';
import { Specialization } from 'src/specializations/entities/specialization.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';
import { User } from 'src/users/entities/user.entity';
import { IPayload } from 'src/auth/auth.service';
import { Patient } from 'src/patients/entities/patient.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private feedBackService: FeedbacksService,
  ) { }
  create(createDoctorDto: CreateDoctorDto) {
    return 'This action adds a new doctor';
  }

  async getFormattedDoctorsOrderByAverageRating(payload: IPayload, limit: number | null): Promise<any[]> {
    // Lấy danh sách bác sĩ và sắp xếp theo đánh giá trung bình
    const doctors = await this.getDoctorsOrderByAverageRating(payload, limit);

    // Định dạng thông tin bác sĩ và lịch trình làm việc
    const formattedDoctors = doctors.map((doctor) => {
      const scheduleString = DateHelper.formatSchedule(
        doctor.start_day_of_week,
        doctor.time_start,
        doctor.end_day_of_week,
        doctor.time_end
      );

      // Xóa các thuộc tính không cần thiết
      delete doctor.start_day_of_week;
      delete doctor.end_day_of_week;
      delete doctor.time_start;
      delete doctor.time_end;

      return {
        ...doctor,
        schedule: scheduleString,
      };
    });

    return formattedDoctors;
  }

  async getDoctorsOrderByAverageRating(payload: IPayload, limit: number | null): Promise<Doctor[]> {
    // Sử dụng QueryBuilder để JOIN và GROUP BY
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
        'specialization.name',
        'specialization.id',
        'specialization.description',
        'specialization.icon',
        'AVG(feedback.rating) as averageRating',
        'COUNT(feedback.id) as feedbackCount',
        'CASE WHEN pd.patient_id IS NOT NULL THEN true ELSE false END as isFavorite'
      ])
      .groupBy('doctor.id')
      .orderBy('averageRating', 'DESC');

    // Sắp xếp theo điểm trung bình giảm dần

    if (limit) {
      await doctorsWithFeedback.limit(limit);
    }

    const rawDoctors = await doctorsWithFeedback.getRawMany();

    const formattedDoctors = rawDoctors.map(doctor => ({
      ...doctor,
      averageRating: parseFloat(doctor.averageRating).toFixed(1),
      schedule: DateHelper.formatSchedule(
        doctor.start_day_of_week,
        doctor.time_start,
        doctor.end_day_of_week,
        doctor.time_end
      ),
    }));

    return formattedDoctors;
  }

  async getPatientByDoctorId(doctorId: number) {
    const status = AppointmentStatus.COMPLETED;
    const result = await this.appointmentRepository.createQueryBuilder('appointment')
      .select('COUNT(appointment.id)', 'appointmentCount')
      .where('appointment.doctorId = :doctorId', { doctorId })
      .andWhere('appointment.status = :status', { status })
      .getRawOne();

    return {
      countPatient: result.appointmentCount,
    }
  }

  async getTimeWorkingByDoctorId(doctorId: number) {
    const result = await this.doctorRepository.createQueryBuilder('doctor')
      .select('doctor.time_start', 'timeStart')
      .addSelect('doctor.time_end', 'timeEnd')
      .whereInIds(doctorId)
      .getRawOne();

    return {
      timeStart: result.timeStart,
      timeEnd: result.timeEnd
    }
  }

  async findBySpeciality(payload: IPayload, specialityId: number) {
    const speciality = await this.specializationRepository.findOne({
      where: { id: specialityId },
      relations: ["doctors"],
    });

    const { doctors } = speciality;
    if (doctors.length === 0) {
      return [];
    }

    const patient = await this.patientRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.account', 'account')
      .where('account.id = :accountId', { accountId: payload.sub })
      .getOne();

    if (!patient) {
      return [];
    }

    // Sử dụng QueryBuilder để JOIN và GROUP BY
    const doctorsWithFeedback = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.feedbacks', 'feedback')
      .innerJoinAndSelect('doctor.specialization', 'specialization')
      .leftJoin('patient_doctor', 'pd', 'pd.doctor_id = doctor.id AND pd.patient_id = :patientId', { patientId: patient.id })
      .select([
        'doctor.*',
        'specialization.name',
        'specialization.id',
        'specialization.description',
        'specialization.icon',
        'AVG(feedback.rating) as averageRating',
        'COUNT(feedback.id) as feedbackCount',
        'CASE WHEN pd.patient_id IS NOT NULL THEN true ELSE false END as isFavorite'
      ])
      .where('doctor.id IN (:...doctorIds)', { doctorIds: doctors.map(d => d.id) })
      .groupBy('doctor.id')
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

    return formattedDoctors;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return await this.doctorRepository.update(id, updateDoctorDto);
  }

  async remove(id: number) {
    // Find the doctor entity
    const doctor = await this.doctorRepository.findOne({ where: { id }, relations: ['appointments', 'feedbacks'] });
    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    // Delete related appointments
    if (doctor.appointments && doctor.appointments.length > 0) {
      await Promise.all(doctor.appointments.map(appointment => this.appointmentRepository.delete(appointment.id)));
    }

    // Delete related feedbacks
    if (doctor.feedbacks && doctor.feedbacks.length > 0) {
      await Promise.all(doctor.feedbacks.map(feedback => this.feedbackRepository.delete(feedback.id)));
    }

    // Load the related account using lazy loading
    const account = await doctor.account;
    if (account) {
      await this.userRepository.delete(account.id);
    }

    // Remove the doctor entity
    await this.doctorRepository.remove(doctor);
  }

  async searchDoctor(name: string) {
    // Sử dụng QueryBuilder để JOIN và GROUP BY
    const doctorsWithFeedback = await this.doctorRepository
      .createQueryBuilder('doctor')
      .where('doctor.name LIKE :name', { name: `%${name}%` })
      .leftJoinAndSelect('doctor.feedbacks', 'feedback')
      .innerJoinAndSelect('doctor.specialization', 'specialization')
      .select([
        'doctor.*',
        'specialization.name',
        'specialization.id',
        'specialization.description',
        'specialization.icon',
        'AVG(feedback.rating) as averageRating',
        'COUNT(feedback.id) as feedbackCount',
      ])
      .groupBy('doctor.id')
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

    return formattedDoctors;
  }
}
