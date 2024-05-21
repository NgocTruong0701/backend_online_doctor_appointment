import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, HttpException, Query } from '@nestjs/common';
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
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { FavoriteDoctorDto } from './dto/favorite-doctor.dto';
import { UpdateFeedbackDto } from 'src/feedbacks/dto/update-feedback.dto';

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
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/feedback/update/:id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.PATIENT)
  async patientUpdateFeedback(@Req() req, @Param('id', new ParseIntPipe()) id: number, @Body() updateFeedbackDto: UpdateFeedbackDto): Promise<ResponseData<boolean>> {
    try {
      return new ResponseData<boolean>(await this.feedbackService.update(req.user as IPayload, id, updateFeedbackDto), HttpStatusCode.CREATED, HttpMessage.CREATED);
    } catch (error) {
      throw new HttpException(error.message, error.status);
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

  @Get('get-doctor-favorite')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.PATIENT)
  async getDoctorFavorite(
    @Req() req
  ) {
    try {
      const result = await this.patientsService.getDoctorFavorite(req.user as IPayload);
      return new ResponseData<Doctor>(result, HttpStatusCode.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('favorite-doctor')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.PATIENT)
  async favoriteDoctor(
    @Body() favoriteDoctorDto: FavoriteDoctorDto
  ) {
    try {
      const result = await this.patientsService.favoriteDoctor(favoriteDoctorDto);
      return new ResponseData<boolean>(result, HttpStatusCode.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

}
