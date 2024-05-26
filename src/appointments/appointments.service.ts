import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { ResponseData } from 'src/common/global/responde.data';
import { HttpMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from 'src/common/enum/roles.enum';
import { AppointmentStatus } from 'src/common/enum/appointment.status.enum';
import { IPayload } from 'src/auth/auth.service';
import { PackageAppointment } from 'src/package-appointments/entities/package-appointment.entity';
import { DateHelper } from 'src/common/helper/date.helper';
import { AppointmentContact } from 'src/appointment-contacts/entities/appointment-contacts.entity';

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
    @InjectRepository(PackageAppointment)
    private packageAppointmentRepository: Repository<PackageAppointment>,
    @InjectRepository(AppointmentContact)
    private appointmentContactRepository: Repository<AppointmentContact>,
    private mailerService: MailerService,
  ) { }

  async create(payload: IPayload, createAppointmentDto: CreateAppointmentDto): Promise<ResponseData<Appointment>> {
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
    const packageAppointment = await this.packageAppointmentRepository.findOneBy({ id: createAppointmentDto.packageAppointmentId });

    if (!packageAppointment) {
      throw new NotFoundException('Patient not found');
    }

    appointment.date = createAppointmentDto.date;
    appointment.description = createAppointmentDto.description;
    delete (await doctor.account).password;
    appointment.doctor = doctor;
    appointment.patient = account.patient;
    appointment.duration = createAppointmentDto.duration;
    appointment.packageAppointment = packageAppointment;

    await this.appointmentRepository.save(appointment);

    const message = new AppointmentContact();
    message.name = `Appointment of ${account.patient.name} and ${doctor.name} - ${createAppointmentDto.date}`;
    message.numberOne = account.patient.id;
    message.numberTwo = doctor.id;
    message.appointment = appointment;
    await this.appointmentContactRepository.save(message);

    const packageName = await this.packageAppointmentRepository.findOneBy({ id: createAppointmentDto.packageAppointmentId });
    const duration = createAppointmentDto.duration * 60;

    await this.mailerService.sendMail({
      to: account.email,
      subject: `Confirmation of Online Consultation/Check-up Appointment for ${account.patient.name} on ${createAppointmentDto.date}`,
      template: './appointment_patient_mail.hbs',
      context: {
        patient: account.patient.name,
        date: createAppointmentDto.date,
        doctor: doctor.name,
        description: createAppointmentDto.description,
        package: packageName.name,
        duration: duration
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
        description: createAppointmentDto.description,
        package: packageName.name,
        duration: duration
      },
    });

    delete appointment.doctor.account;
    return new ResponseData<Appointment>(appointment, HttpStatusCode.CREATED, HttpMessage.CREATED);
  }

  async cancelAppointments(user: IPayload, id: number): Promise<boolean> {
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
        case AppointmentStatus.UPCOMING:
          appointment.status = AppointmentStatus.CANCELLED;
          break;
        case AppointmentStatus.COMPLETED:
          throw new ConflictException('The appointment has been completed and cannot be canceled.');
        case AppointmentStatus.CANCELLED:
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

  async completeAppointment(user: IPayload, id: number): Promise<boolean> {
    const account = await this.userRepository.findOneBy({ id: user.sub });
    const appointment = await this.appointmentRepository.findOneBy({ id: id });

    if (account.role === Role.PATIENT || account.role === Role.DOCTOR) {
      // Update appointment status based on its current status
      appointment.status = AppointmentStatus.COMPLETED;
      // Update appointment status in the repository
      await this.appointmentRepository.update(appointment.id, appointment);
      return true;
    }

    return false;
  }

  async getAppointmentByUserId(userId: number, status: string): Promise<Appointment[]> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const statusKey = Object.keys(AppointmentStatus).find(
      (key) => AppointmentStatus[key] === status,
    );
    if (!statusKey) {
      throw new BadRequestException('Invalid status');
    }

    let appointments = null;

    if (user.role === Role.PATIENT) {
      appointments = await this.appointmentRepository.find({
        where: {
          patient: { id: user.patient.id },
          status: AppointmentStatus[statusKey],
        },
        relations: ['doctor', 'packageAppointment', 'patient', 'doctor.feedbacks', 'doctor.specialization'],
      });
    } else if (user.role === Role.DOCTOR) {
      appointments = await this.appointmentRepository.find({
        where: {
          doctor: { id: user.doctor.id },
          status: AppointmentStatus[statusKey],
        },
        relations: ['patient', 'packageAppointment', 'doctor', 'doctor.feedbacks', 'doctor.specialization'],
      });
    } else {
      throw new BadRequestException('Invalid user role');
    }

    // Format doctor data
    const formattedAppointments = appointments.map((appointment) => {
      const doctor = appointment.doctor;

      const averageRating =
        doctor.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
        doctor.feedbacks.length;

      const formattedDoctor = {
        created_at: doctor.created_at,
        updated_at: doctor.updated_at,
        specialization_id: doctor.specialization.id,
        specialization_name: doctor.specialization.name,
        specialization_description: doctor.specialization.description,
        specialization_icon: doctor.specialization.icon,
        id: doctor.id,
        name: doctor.name,
        date_of_birth: doctor.date_of_birth,
        gender: doctor.gender,
        phone_number: doctor.phone_number,
        avatar: doctor.avatar,
        address: doctor.address,
        account: doctor.account,
        specializationId: doctor.specializationId,
        hospital: doctor.hospital,
        years_experience: doctor.years_experience,
        description: doctor.description,
        averageRating: averageRating.toFixed(1),
        feedbackCount: doctor.feedbacks.length.toString(),
        schedule: DateHelper.formatSchedule(
          doctor.start_day_of_week,
          doctor.time_start,
          doctor.end_day_of_week,
          doctor.time_end,
        ),
      };

      return {
        ...appointment,
        doctor: formattedDoctor,
      };
    });

    return formattedAppointments;
  }

  async findAll() {
    return await this.appointmentRepository.find({
      relations: ['patient', 'doctor', 'packageAppointment']
    });
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
