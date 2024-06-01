import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Role } from 'src/common/enum/roles.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { AppointmentStatus } from 'src/common/enum/appointment.status.enum';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
    ) { }

    async getDataDashboardTotal() {
        const countPatient = await this.userRepository.count({ where: { role: Role.PATIENT } });
        const countDoctor = await this.userRepository.count({ where: { role: Role.DOCTOR } });

        const countAppointment = await this.appointmentRepository.count();

        const today = moment().startOf('day').toDate();

        const countTodayAppointments = await this.appointmentRepository.createQueryBuilder("appointment")
            .where("appointment.created_at >= :today", { today })
            .getCount();

        return {
            countPatient,
            countDoctor,
            countAppointment,
            countTodayAppointments
        };
    }

    async getDataAppointment() {
        const appointmentUpComming = await this.appointmentRepository.count({ where: { status: AppointmentStatus.UPCOMING } });
        const appointmentCompleted = await this.appointmentRepository.count({ where: { status: AppointmentStatus.COMPLETED } });
        const appointmentCancelled = await this.appointmentRepository.count({ where: { status: AppointmentStatus.CANCELLED } });

        return {
            appointmentUpComming,
            appointmentCompleted,
            appointmentCancelled
        }
    }
}