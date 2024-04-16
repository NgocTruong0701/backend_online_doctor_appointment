import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFeedbackDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    doctor_id: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    rating: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    comment: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    date: Date;
}