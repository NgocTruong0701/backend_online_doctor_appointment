import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class FavoriteDoctorDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly patientId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly doctorId: number;
}
