import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';
import { DateHelper } from 'src/common/helper/date.helper';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { AppointmentStatus } from 'src/common/enum/appointment.status.enum';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) { }
  create(createDoctorDto: CreateDoctorDto) {
    return 'This action adds a new doctor';
  }

  async findAll() {
    const doctors = await this.doctorRepository.find();

    const formattedDoctors = doctors.map((doctor) => {
      // Định dạng lịch trình làm việc
      const scheduleString = DateHelper.formatSchedule(
        doctor.start_day_of_week,
        doctor.time_start,
        doctor.end_day_of_week,
        doctor.time_end
      );
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

  async getPatientByDoctorId(doctorId: number) {
    const status = AppointmentStatus.COMFIRMED;
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

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
