import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => (
        {
          type: 'mysql',
          host: configService.get('HOST'),
          port: +configService.get('PORT'),
          username: configService.get('USER_NAME'),
          password: configService.get('PASSWORD'),
          database: configService.get('DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        }),
      inject: [ConfigService]
    }),
    PatientsModule,
    DoctorsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
