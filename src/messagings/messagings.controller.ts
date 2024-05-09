import { Controller, HttpException, Post } from '@nestjs/common';
import { MessagingsService } from './messagings.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('messagings')
@ApiTags('messagings')
export class MessagingsController {
  constructor(private readonly messagingsService: MessagingsService) { }

  @Post('/create')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  async createNewAppointmentChat() {
    try {
      const result = await this.messagingsService.createNewAppointmentChat();
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
