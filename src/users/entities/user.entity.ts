import { Role } from "src/common/enum/roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
