import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Role } from './common/enum/roles.enum';
import { Roles } from './common/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  // @UseGuards(AuthJwtGuard)
  @ApiBearerAuth() 
  @Roles(Role.PATIENT)
  getProfile2(
    @Req()
    request,
  ){
    return request.user;
  }
}
