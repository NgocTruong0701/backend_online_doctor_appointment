import { Module } from '@nestjs/common';
import { AppointmentContactsService } from './appointment-contacts.service';
import { AppointmentContactsController } from './appointment-contacts.controller';

@Module({
  controllers: [AppointmentContactsController],
  providers: [AppointmentContactsService],
})
export class AppointmentContactsModule {}
