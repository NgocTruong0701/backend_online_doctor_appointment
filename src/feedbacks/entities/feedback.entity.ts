import { Doctor } from "src/doctors/entities/doctor.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('feedbacks')
export class Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @Column()
    date: Date;

    @ManyToOne(() => Patient, (patient) => patient.feedbacks)
    patient: Patient;

    @ManyToOne(() => Doctor, (doctor) => doctor.feedbacks)
    doctor: Doctor;
}