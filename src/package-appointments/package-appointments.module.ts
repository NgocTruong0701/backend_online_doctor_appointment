import { Module } from '@nestjs/common';
import { PackageAppointmentsService } from './package-appointments.service';
import { PackageAppointmentsController } from './package-appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageAppointment } from './entities/package-appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PackageAppointment])
  ],
  controllers: [PackageAppointmentsController],
  providers: [PackageAppointmentsService],
})
export class PackageAppointmentsModule { }
