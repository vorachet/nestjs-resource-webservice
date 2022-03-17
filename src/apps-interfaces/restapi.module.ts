import { Module } from '@nestjs/common';
import { DBLogService } from 'src/services/dblog.service';
import { SecurityModule } from 'src/security/security.module';
import { MongoService } from 'src/services/mongo.service';
import { AdminController } from './admin.controller';
import { RegistrationController } from './registration.controller';
import { MediaController } from './media.controller';
import { UserAdminController } from './useradmin.controller';
import { MicroserviceService } from 'src/services/microservice.service';
import { ControllerModule } from 'libs/controller/src';
import { UserController } from './user.controller';

@Module({
  imports: [SecurityModule, ControllerModule],
  controllers: [
    AdminController,
    RegistrationController,
    MediaController,
    UserAdminController,
    UserController,
  ],
  providers: [MongoService, DBLogService, MicroserviceService],
})
export class RestapiModule {}
