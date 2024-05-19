import { Appointment } from "src/appointments/entities/appointment.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('appointment-contacts')
export class AppointmentContact {
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