import { Appointment } from "src/appointments/entities/appointment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @JoinColumn({ name: 'account' })
    @OneToOne(() => User, (user) => user.patient)
    account: User;

    @OneToMany(() => Appointment, (appointment) => appointment.patient)
    appointments: Patient[];
}
