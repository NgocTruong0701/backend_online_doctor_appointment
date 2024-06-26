import { Appointment } from "src/appointments/entities/appointment.entity";
import { Doctor } from "src/doctors/entities/doctor.entity";
import { Feedback } from "src/feedbacks/entities/feedback.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Table, UpdateDateColumn } from "typeorm";

@Entity('patients')
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "date", nullable: true })
    date_of_birth: Date;

    @Column({ nullable: true })
    gender: number;

    @Column({ nullable: true })
    phone_number: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    address: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @JoinColumn({ name: 'account' })
    @OneToOne(() => User, (user) => user.patient)
    account: User;

    @OneToMany(() => Appointment, (appointment) => appointment.patient)
    appointments: Patient[];

    @OneToMany(() => Feedback, (feedback) => feedback.patient)
    feedbacks: Feedback[];

    @ManyToMany(() => Doctor, { cascade: true })
    @JoinTable({
        name: 'patient_doctor',
        joinColumns: [{ name: 'patient_id' }],
        inverseJoinColumns: [{ name: 'doctor_id' }]
    })
    doctors: Doctor[];
}
