import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { CreateAppointmentDto } from 'src/appointments/dto/create-appointment.dto';
import { ResponseData } from 'src/common/global/responde.data';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { HtppMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';

@Controller('patients')
@ApiTags('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly appointmentsService: AppointmentsService,
  ) { }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  getProfile(@Req() request) {
    return this.patientsService.getProfile(request.user);
  }
  @Post('/appointments')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.PATIENT)
  async createAppointment(@Req() req, @Body() createAppointmentDto: CreateAppointmentDto): Promise<ResponseData<Appointment>> {
    try {
      return await this.appointmentsService.create(req.user, createAppointmentDto);
    } catch (error) {
      return new ResponseData<Appointment>(null, HttpStatusCode.INTERNAL_SERVER_ERROR, HtppMessage.INTERNAL_SERVER_ERROR, error);
    }
  }
}
