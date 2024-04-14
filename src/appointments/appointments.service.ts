import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from 'src/common/enum/roles.enum';
import { AppointmentStatus } from 'src/common/enum/appointment.status.enum';

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
    private mailerService: MailerService,
  ) { }

  async create(payload: any, createAppointmentDto: CreateAppointmentDto): Promise<ResponseData<Appointment>> {
    const account = await this.userRepository.findOneBy({ id: payload.sub });
    if (!account) {
      throw new NotFoundException('Patient not found');
    }
    const doctor = await this.doctorRepository.findOneBy({ id: createAppointmentDto.doctorId });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const appointment = new Appointment();
    const doctorAcount = await doctor.account;

    appointment.date = createAppointmentDto.date;
    appointment.description = createAppointmentDto.description;
    delete (await doctor.account).password;
    appointment.doctor = doctor;
    appointment.patient = account.patient;

    await this.appointmentRepository.save(appointment);

    await this.mailerService.sendMail({
      to: account.email,
      subject: `Confirmation of Online Consultation/Check-up Appointment for ${account.patient.name} on ${createAppointmentDto.date}`,
      template: './appointment_patient_mail.hbs',
      context: {
        patient: account.patient.name,
        date: createAppointmentDto.date,
        doctor: doctor.name,
        description: createAppointmentDto.description
      },
    });

    await this.mailerService.sendMail({
      to: doctorAcount.email,
      subject: `Confirmation of Online Consultation/Check-up Appointment for ${account.patient.name} on ${createAppointmentDto.date}`,
      template: './appointment_doctor_mail.hbs',
      context: {
        patient: account.patient.name,
        date: createAppointmentDto.date,
        doctor: doctor.name,
        description: createAppointmentDto.description
      },
    });

    delete appointment.doctor.account;
    const a = 1;
    return new ResponseData<Appointment>(appointment, HttpStatusCode.CREATED, HtppMessage.CREATED);
  }

  async comfirmAppointments(user, id: number): Promise<boolean> {
    // Find user account and appointment by id
    const account = await this.userRepository.findOneBy({ id: user.sub });
    const appointment = await this.appointmentRepository.findOneBy({ id: id });

    // Check if appointment exists and if the appointment date has passed
    if (!appointment || appointment.date.getTime() < Date.now()) {
      throw new BadRequestException('The current time has passed the appointment date.');
    }

    // Confirm appointment based on user role
    if (account.role === Role.PATIENT || account.role === Role.DOCTOR) {
      // Update appointment status based on its current status
      switch (appointment.status) {
        case AppointmentStatus.PENDING:
          appointment.status = (account.role === Role.PATIENT) ? AppointmentStatus.PATIENT_COMFIRMED : AppointmentStatus.DOCTOR_COMFIRMED;
          break;
        case AppointmentStatus.DOCTOR_COMFIRMED:
        case AppointmentStatus.COMFIRMED:
        case AppointmentStatus.PATIENT_COMFIRMED:
          appointment.status = AppointmentStatus.COMFIRMED;
          break;
        default:
          throw new ConflictException('The appointment has been canceled and cannot be confirmed.');
      }

      // Update appointment status in the repository
      await this.appointmentRepository.update(appointment.id, appointment);
      return true;
    }

    // If the user role is neither patient nor doctor, return false
    return false;
  }

  async cancelAppointments(user: any, id: number): Promise<boolean> {
    // Find user account and appointment by id
    const account = await this.userRepository.findOneBy({ id: user.sub });
    const appointment = await this.appointmentRepository.findOneBy({ id: id });

    // Check if appointment exists and if the appointment date has passed
    if (!appointment || appointment.date.getTime() < Date.now()) {
      throw new BadRequestException('The current time has passed the appointment date.');
    }

    // Confirm appointment based on user role
    if (account.role === Role.PATIENT || account.role === Role.DOCTOR) {
      // Update appointment status based on its current status
      switch (appointment.status) {
        case AppointmentStatus.PENDING:
        case AppointmentStatus.PATIENT_COMFIRMED:
        case AppointmentStatus.DOCTOR_COMFIRMED:
          appointment.status = (account.role === Role.PATIENT) ? AppointmentStatus.PATIENT_CANCELLED : AppointmentStatus.DOCTOR_CANCELLED;
          break;
        case AppointmentStatus.COMFIRMED:
          throw new ConflictException('The appointment has been confirmed and cannot be canceled.');
        case AppointmentStatus.DOCTOR_CANCELLED:
        case AppointmentStatus.PATIENT_CANCELLED:
          throw new ConflictException('The appointment has already been canceled.');
        default:
          throw new ConflictException('Invalid appointment status.');
      }

      // Update appointment status in the repository
      await this.appointmentRepository.update(appointment.id, appointment);
      return true;
    }

    // If the user role is neither patient nor doctor, return false
    return false;
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
