import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Role } from "src/common/enum/roles.enum";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    date_of_birth: Date;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    gender: number;

    @ApiProperty()
    @IsOptional()
    @IsPhoneNumber()
    phone_number: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    avatar: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    address: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ enum: Role, default: Role.PATIENT })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}
