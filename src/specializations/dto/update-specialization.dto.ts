import { PartialType } from '@nestjs/swagger';
import { CreateSpecializationDto } from './create-specialization.dto';

export class UpdateSpecializationDto extends PartialType(CreateSpecializationDto) {}
