import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, Query, Req } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { ResponseData } from 'src/common/global/responde.data';
import { Doctor } from './entities/doctor.entity';
import { HttpMessage, HttpStatusCode } from 'src/common/enum/httpstatus.enum';
import { IPayload } from 'src/auth/auth.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';

@Controller('doctors')
@ApiTags('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.PATIENT)
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  async findAll(
    @Req() req,
    @Query('limit') limit?: number
  ): Promise<ResponseData<Doctor[]>> {
    try {
      const doctors = await this.doctorsService.getFormattedDoctorsOrderByAverageRating(req.user as IPayload, limit);
      return new ResponseData<Doctor[]>(doctors, HttpStatusCode.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/speciality/:specialityId')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.PATIENT)
  async findBySpeciality(
    @Req() req,
    @Param('specialityId', new ParseIntPipe()
    ) specialityId: number): Promise<ResponseData<Doctor[]>> {
    try {
      const doctors = await this.doctorsService.findBySpeciality(req.user as IPayload, specialityId);
      return new ResponseData<Doctor[]>(doctors, HttpStatusCode.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.DOCTOR, Role.ADMIN)
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    try {
      const result = await this.doctorsService.update(id, updateDoctorDto);;
      return new ResponseData(result, HttpStatusCode.OK, HttpMessage.OK);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    try {
      const result = await this.doctorsService.remove(+id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  @Get('/search')
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'name of doctor',
  })
  @Public()
  async searchDoctor(
    @Query('name') name?: string
  ) {
    try {
      const result = await this.doctorsService.searchDoctor(name);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
