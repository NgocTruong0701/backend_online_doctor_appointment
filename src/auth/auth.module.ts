import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [PatientsModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
