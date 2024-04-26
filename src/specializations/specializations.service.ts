import { Injectable } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

@Injectable()
export class SpecializationsService {
  create(createSpecializationDto: CreateSpecializationDto) {
    return 'This action adds a new specialization';
  }

  findAll() {
    return `This action returns all specializations`;
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
