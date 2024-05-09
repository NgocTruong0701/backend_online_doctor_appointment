import { Module } from '@nestjs/common';
import { MessagingsService } from './messagings.service';
import { MessagingsController } from './messagings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messaging } from './entities/messagings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Messaging]),
  ],
  controllers: [MessagingsController],
  providers: [MessagingsService],
})
export class MessagingsModule { }
