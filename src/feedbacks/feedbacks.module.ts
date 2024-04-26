import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Feedback, Patient, Doctor, User])],
    controllers: [],
    providers: [FeedbacksService],
    exports: [FeedbacksService],
})
export class FeedbacksModule {}
