import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFeedbackDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    doctor_id: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    rating: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    comment: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    date: Date;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    appointment_id: number;
}