import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { ResponseData } from 'src/common/global/responde.data';
import { Doctor } from './entities/doctor.entity';
import { HttpMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';

@Controller('doctors')
@ApiTags('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @Public()
  async findAll(): Promise<ResponseData<Doctor[]>> {
    try {
      const doctors = await this.doctorsService.findAll();
      return new ResponseData<Doctor[]>(doctors, HttpStatusCode.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }

  @Get('/count-patients/:id')
  @Public()
  async getCountPatients(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const result = await this.doctorsService.getPatientByDoctorId(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/get-timeworking/:id')
  @Public()
  async getTimeWorkingByDoctorId(
    @Param('id', new ParseIntPipe()) id: number
  ) {
    try {
      const result = await this.doctorsService.getTimeWorkingByDoctorId(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
