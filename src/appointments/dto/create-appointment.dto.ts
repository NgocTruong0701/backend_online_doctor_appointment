import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAppointmentDto {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: Date;

    // @IsNotEmpty()
    // @IsNumber()
    // @ApiProperty()
    // patientId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    doctorId: number;
}
