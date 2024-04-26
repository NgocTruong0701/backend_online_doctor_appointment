import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAppointmentDto {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: Date;

    // @IsNotEmpty()
    // @IsNumber()
    // @ApiProperty()
    // patientId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    doctorId: number;
}
