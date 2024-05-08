import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { PackageAppointmentsService } from './package-appointments.service';
import { CreatePackageAppointmentDto } from './dto/create-package-appointment.dto';
import { UpdatePackageAppointmentDto } from './dto/update-package-appointment.dto';
import { ResponseData } from 'src/common/global/responde.data';
import { PackageAppointment } from './entities/package-appointment.entity';
import { HttpMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';


@ApiTags('package-appointments')
@Controller('package-appointments')
export class PackageAppointmentsController {
  constructor(private readonly packageAppointmentsService: PackageAppointmentsService) { }

  @Post()
  @Public()
  async create(@Body() createPackageAppointmentDto: CreatePackageAppointmentDto) {
    try {
      const result = await this.packageAppointmentsService.create(createPackageAppointmentDto);
      return new ResponseData<PackageAppointment>(result, HttpStatusCode.CREATED, HttpMessage.CREATED);
    } catch (error) {
      throw new HttpException(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll() {
    return this.packageAppointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageAppointmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageAppointmentDto: UpdatePackageAppointmentDto) {
    return this.packageAppointmentsService.update(+id, updatePackageAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageAppointmentsService.remove(+id);
  }
}
