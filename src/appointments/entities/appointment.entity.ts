import { AppointmentStatus } from "src/common/enum/appointment.status.enum";
import { Doctor } from "src/doctors/entities/doctor.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date" })
    date: Date;

    @Column({
        type: "enum",
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDING
    })
    status: AppointmentStatus;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Patient, (patient) => patient.appointments)
    patient: Patient;

    @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
    doctor: Doctor;
}
