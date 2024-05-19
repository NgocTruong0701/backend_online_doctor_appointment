import { Controller } from '@nestjs/common';
import { AppointmentContactsService } from './appointment-contacts.service';

@Controller('appointment-contacts')
export class AppointmentContactsController {
  constructor(private readonly appointmentContactsService: AppointmentContactsService) {}
}
