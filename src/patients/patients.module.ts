import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { User } from 'src/users/entities/user.entity';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, User]),
    AppointmentsModule,
    FeedbacksModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
