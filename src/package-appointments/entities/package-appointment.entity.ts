import { Appointment } from "src/appointments/entities/appointment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('package_appointments')
export class PackageAppointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @OneToMany(() => Appointment, (appointment) => appointment.packageAppointment)
    appointments: Appointment;
}
