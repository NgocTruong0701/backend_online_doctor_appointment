import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePackageAppointmentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly price: number;
}
