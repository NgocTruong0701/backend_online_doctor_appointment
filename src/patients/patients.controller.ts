import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, HttpException } from '@nestjs/common';
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
import { HttpMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { CreateFeedbackDto } from 'src/feedbacks/dto/create-feedback.dto';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';
import { IPayload } from 'src/auth/auth.service';
import { UpdateResult } from 'typeorm';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('patients')
@ApiTags('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly feedbackService: FeedbacksService,
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
      return await this.appointmentsService.create(req.user as IPayload, createAppointmentDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/feedback/create')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.PATIENT)
  async patientCreateFeedback(@Req() req, @Body() createFeedbackDto: CreateFeedbackDto): Promise<ResponseData<Feedback>> {
    try {
      return new ResponseData<Feedback>(await this.feedbackService.create(req.user as IPayload, createFeedbackDto), HttpStatusCode.CREATED, HttpMessage.CREATED);
    } catch (error) {
      return new ResponseData<Feedback>(null, HttpStatusCode.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.PATIENT)
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() updatePatientDto: UpdatePatientDto): Promise<ResponseData<UpdateResult>> {
    try {
      const result = await this.patientsService.update(id, updatePatientDto);
      return new ResponseData<UpdateResult>(result, HttpStatusCode.OK, HttpMessage.OK);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
