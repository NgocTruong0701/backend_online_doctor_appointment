import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateDoctorDto {
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
    @IsString()
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
    @IsString()
    @IsOptional()
    hospitals: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    years_experience: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;
}
