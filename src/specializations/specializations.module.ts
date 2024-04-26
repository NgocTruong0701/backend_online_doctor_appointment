import { Module } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { SpecializationsController } from './specializations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialization } from './entities/specialization.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialization, Doctor]),
  ],
  controllers: [SpecializationsController],
  providers: [SpecializationsService],
})
export class SpecializationsModule {}
