import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { ResponseData } from 'src/common/global/responde.data';
import { HtppMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(payload: any, createAppointmentDto: CreateAppointmentDto): Promise<ResponseData<Appointment>> {
    const account = await this.userRepository.findOneBy({ id: payload.id });
    const doctor = await this.doctorRepository.findOneBy({ id: createAppointmentDto.doctorId });
    const appointment = new Appointment();

    appointment.date = createAppointmentDto.date;
    appointment.doctor = doctor;
    appointment.patient = account.patient;

    await this.appointmentRepository.save(appointment);

    return new ResponseData<Appointment>(appointment, HttpStatusCode.CREATED, HtppMessage.CREATED);
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
