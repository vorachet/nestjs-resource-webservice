import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { MongoService } from 'src/services/mongo.service';
import * as dotenv from 'dotenv';
import { MicroserviceService } from 'src/services/microservice.service';
import { GeneratorModule } from 'libs/generator/src';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    GeneratorModule,
  ],
  providers: [AuthService, MongoService, MicroserviceService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class SecurityModule {}
