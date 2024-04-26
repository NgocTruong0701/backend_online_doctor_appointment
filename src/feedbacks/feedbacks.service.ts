import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { User } from 'src/users/entities/user.entity';
import { ResponseData } from 'src/common/global/responde.data';
import { HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbacksService {
    constructor(
        @InjectRepository(Feedback)
        private feedbackRepository: Repository<Feedback>,
        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,
        @InjectRepository(Doctor)
        private doctorRepository: Repository<Doctor>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(payload: any, createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
        const userPatient = await this.userRepository.findOneBy({ id: payload.sub });
        const patient = userPatient.patient;
        const doctor = await this.doctorRepository.findOneBy({ id: createFeedbackDto.doctor_id });

        if (!patient || !doctor) {
            throw new NotFoundException('Patient or doctor not found.');
        }

        const feedback = this.feedbackRepository.create({
            rating: createFeedbackDto.rating,
            comment: createFeedbackDto.comment,
            date: createFeedbackDto.date,
            doctor: doctor,
            patient: userPatient.patient
        });

        return this.feedbackRepository.save(feedback);
    }

    async update(payload: any, id: number, updateFeedbackDto: UpdateFeedbackDto): Promise<boolean> {
        const userPatient = await this.userRepository.findOneBy({ id: payload.sub });
        const patient = userPatient.patient;

        const feedback = await this.feedbackRepository.findOneBy({ id: id });
        if (!feedback) {
            throw new NotFoundException('Feedback not found.');
        }

        if (feedback.patient !== patient) {
            throw new BadRequestException('Patient is not valid for this feedback.');
        }

        const result = await this.feedbackRepository.update(id, updateFeedbackDto);
        return !!result;
    }

    async averageRating(doctor_id: number) {
        const doctor = await this.doctorRepository.findOneBy({ id: doctor_id });
        const feedbackOfDoctor = await this.feedbackRepository.findBy({ doctor: doctor });

        const sumRating = feedbackOfDoctor.reduce((sumRating, currentRating) => sumRating + currentRating.rating, 0);
        const countFeedback = feedbackOfDoctor.length;
        const average = sumRating / countFeedback;

        return Math.round(average * 100) / 100;
    }
}
