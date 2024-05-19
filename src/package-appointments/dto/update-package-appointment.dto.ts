import { PartialType } from '@nestjs/swagger';
import { CreatePackageAppointmentDto } from './create-package-appointment.dto';

export class UpdatePackageAppointmentDto extends PartialType(CreatePackageAppointmentDto) {}
