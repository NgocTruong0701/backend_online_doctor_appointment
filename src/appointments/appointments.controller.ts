import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, ParseIntPipe, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { ResponseData } from 'src/common/global/responde.data';
import { HttpMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { IPayload } from 'src/auth/auth.service';
import { Appointment } from './entities/appointment.entity';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('appointments')
@ApiTags('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post('/cancel/:id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.DOCTOR, Role.PATIENT)
  async cancelAppointments(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    try {
      const user = req.user as IPayload;
      const result = await this.appointmentsService.cancelAppointments(user, id);
      if (result) {
        return new ResponseData<boolean>(result, HttpStatusCode.OK, HttpMessage.OK);
      }
      return new ResponseData<boolean>(result, HttpStatusCode.BAD_REQUEST, HttpMessage.BAD_REQUEST);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Post('/complete/:id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.DOCTOR, Role.PATIENT)
  async completeAppointments(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    try {
      const user = req.user as IPayload;
      const result = await this.appointmentsService.completeAppointment(user, id);
      if (result) {
        return new ResponseData<boolean>(result, HttpStatusCode.OK, HttpMessage.OK);
      }
      return new ResponseData<boolean>(result, HttpStatusCode.BAD_REQUEST, HttpMessage.BAD_REQUEST);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get('/get-by-user/:userId')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  // @Public()
  async getAppointmentByUserId(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Query('status') status: string
  ) {
    try {
      const result = await this.appointmentsService.getAppointmentByUserId(userId, status);
      return new ResponseData<Appointment>(result, HttpStatusCode.OK, HttpMessage.OK);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }


  @Get()
  @Public()
  async findAll() {
    try {
      const result = await this.appointmentsService.findAll();
      return new ResponseData<Appointment[]>(result, HttpStatusCode.OK, HttpMessage.OK);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
