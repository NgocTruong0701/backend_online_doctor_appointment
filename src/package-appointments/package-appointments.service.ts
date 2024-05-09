import { Injectable } from '@nestjs/common';
import { CreatePackageAppointmentDto } from './dto/create-package-appointment.dto';
import { UpdatePackageAppointmentDto } from './dto/update-package-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageAppointment } from './entities/package-appointment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PackageAppointmentsService {
  constructor(
    @InjectRepository(PackageAppointment)
    private packageAppointmentRepository: Repository<PackageAppointment>,
  ) { }
  async create(createPackageAppointmentDto: CreatePackageAppointmentDto) {
    const packageAppointment = new PackageAppointment();
    packageAppointment.name = createPackageAppointmentDto.name;
    packageAppointment.price = createPackageAppointmentDto.price;

    await this.packageAppointmentRepository.save(packageAppointment);

    return packageAppointment;
  }

  async findAll(): Promise<PackageAppointment[]> {
    const packageAppointments = await this.packageAppointmentRepository.find();
    return packageAppointments;
  }

  findOne(id: number) {
    return `This action returns a #${id} packageAppointment`;
  }

  update(id: number, updatePackageAppointmentDto: UpdatePackageAppointmentDto) {
    return `This action updates a #${id} packageAppointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} packageAppointment`;
  }
}
