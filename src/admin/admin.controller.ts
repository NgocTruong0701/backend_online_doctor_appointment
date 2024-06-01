import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ResponseData } from 'src/common/global/responde.data';
import { HttpMessage } from 'src/common/enum/httpstatus.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('data-dashboard-total')
  @Public()
  async getDataDashboard() {
    try {
      const result = await this.adminService.getDataDashboardTotal();
      return new ResponseData(result, HttpStatus.OK, HttpMessage.OK);
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('appointment-dashboard')
  @Public()
  async getDataAppointment() {
    try {
      const result = await this.adminService.getDataAppointment();
      return new ResponseData(result, HttpStatus.OK, HttpMessage.OK);
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
