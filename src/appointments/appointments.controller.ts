import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { ResponseData } from 'src/common/global/responde.data';
import { HtppMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';

@Controller('appointments')
@ApiTags('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post('/comfirm/:id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.DOCTOR, Role.PATIENT)
  async comfirmAppointments(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    try {
      const user = req.user;
      const result = await this.appointmentsService.comfirmAppointments(user, id);
      if (result) {
        return new ResponseData<boolean>(result, HttpStatusCode.OK, HtppMessage.OK);
      }
      return new ResponseData<boolean>(result, HttpStatusCode.BAD_REQUEST, HtppMessage.BAD_REQUEST);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/cancel/:id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.DOCTOR, Role.PATIENT)
  async cancelAppointments(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number
  ) {
    try {
      const user = req.user;
      const result = await this.appointmentsService.cancelAppointments(user, id);
      if (result) {
        return new ResponseData<boolean>(result, HttpStatusCode.OK, HtppMessage.OK);
      }
      return new ResponseData<boolean>(result, HttpStatusCode.BAD_REQUEST, HtppMessage.BAD_REQUEST);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
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
