import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAppointmentContactDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    memberOne: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    memberTwo: number;


    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    appointmentId: number;
}
