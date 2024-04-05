import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePatientDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsDateString()
    @IsOptional()
    date_of_birth: Date;

    @IsNumber()
    @IsOptional()
    gender: number;

    @IsString()
    @IsOptional()
    phone_number: string;

    @IsString()
    @IsOptional()
    avatar: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
