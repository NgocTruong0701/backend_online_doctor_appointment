import { Injectable } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialization } from './entities/specialization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
  ){}

  create(createSpecializationDto: CreateSpecializationDto) {
    return 'This action adds a new specialization';
  }

  async findAll() {
    return await this.specializationRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} specialization`;
  }

  update(id: number, updateSpecializationDto: UpdateSpecializationDto) {
    return `This action updates a #${id} specialization`;
  }

  remove(id: number) {
    return `This action removes a #${id} specialization`;
  }
}
