import { UserRole } from "src/common/enum/roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('doctors')
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    specialization: string;

    @Column()
    phone_number: string;

    @Column({ nullable: true })
    address: string;

    @Column()
    avatar: string;

    @Column()
    gender: number;

    @Column({ type: "date" })
    date_of_birth: Date;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.DOCTOR,
    })
    role: UserRole;
}
