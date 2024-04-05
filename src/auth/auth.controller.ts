import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePatientDto } from 'src/patients/dto/create-patient.dto';
import { Patient } from 'src/patients/entities/patient.entity';
import { PatientsService } from 'src/patients/patients.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private patientService: PatientsService
    ) { }

    @Post('patient/signup')
    async patientSignup(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
        return await this.patientService.create(createPatientDto);
    }
}
