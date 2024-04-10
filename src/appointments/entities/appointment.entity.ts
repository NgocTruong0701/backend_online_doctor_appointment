import { AppointmentStatus } from "src/common/enum/appointment.status.enum";
import { Doctor } from "src/doctors/entities/doctor.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Patient, (patient) => patient.appointments)
    patient: Patient;

    @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
    doctor: Doctor;
}
