import { Role } from "src/common/enum/roles.enum";
import { Doctor } from "src/doctors/entities/doctor.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.PATIENT
    })
    role: Role;

    @Column({ default: false })
    verified: boolean;

    @Column({ nullable: true })
    verificationCode: string;

    @Column({ nullable: true })
    verificationExpiry: Date;

    @OneToOne(() => Patient, (patient) => patient.account)
    patient: Patient;

    @OneToOne(() => Doctor, (doctor) => doctor.account)
    doctor: Doctor;
}
