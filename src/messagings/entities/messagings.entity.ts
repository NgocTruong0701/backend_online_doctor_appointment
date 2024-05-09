import { Appointment } from "src/appointments/entities/appointment.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('messagings')
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numberOne: number;

    @Column()
    numberTwo: number;

    @Column()
    name: string;

    @OneToOne(() => Appointment)
    @JoinColumn()
    appointment: Appointment;
}