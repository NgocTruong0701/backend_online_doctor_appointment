import { Appointment } from "src/appointments/entities/appointment.entity";
import { Feedback } from "src/feedbacks/entities/feedback.entity";
import { Specialization } from "src/specializations/entities/specialization.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('doctors')
export class Doctor {
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

    @Column({nullable: true})
    hospital: string;

    @Column({nullable: true})
    years_experience: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @JoinColumn({ name: 'account' })
    @OneToOne(() => User, (user) => user.doctor, {
        lazy: true,
    })
    account: Promise<User>;

    @ManyToOne(() => Specialization, (specialization) => specialization.doctors, {
        eager: true,
    })
    specialization: Specialization;

    @OneToMany(() => Appointment, (appointment) => appointment.doctor)
    appointments: Appointment[];

    @OneToMany(() => Feedback, (feedback) => feedback.doctor)
    feedbacks: Feedback[];
}
