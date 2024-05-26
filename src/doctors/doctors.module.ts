import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Specialization } from 'src/specializations/entities/specialization.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { Patient } from 'src/patients/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Specialization, Appointment, User, Feedback, Patient]),
    FeedbacksModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule { }
