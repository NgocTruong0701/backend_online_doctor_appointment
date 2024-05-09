import { Module } from '@nestjs/common';
import { MessagingsService } from './messagings.service';
import { MessagingsController } from './messagings.controller';

@Module({
  controllers: [MessagingsController],
  providers: [MessagingsService],
})
export class MessagingsModule {}
