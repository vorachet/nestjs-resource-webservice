import { Controller } from '@nestjs/common';
import { ControllerService } from 'libs/controller/src';
import { AuthService } from 'src/security/auth/auth.service';
import {
  IMicroserviceJob,
  MicroserviceService,
} from 'src/services/microservice.service';
import { MongoService } from 'src/services/mongo.service';

@Controller('microservice')
export class MicroserviceController {
  constructor(
    protected readonly controllerService: ControllerService,
    protected readonly authService: AuthService,
    protected readonly mongoService: MongoService,
    protected readonly microserviceService: MicroserviceService,
  ) {}

  async callMicroservice(job: IMicroserviceJob) {
    return this.microserviceService.callMicroservice(job);
  }

  async isOrgExist(org: string) {
    const existence = await this.mongoService
      .getCollection('org')
      .countDocuments({
        org: org,
      });
    return existence > 0;
  }

  async isOrgUsernameExist(org: string, username: string) {
    const existence = await this.mongoService
      .getCollection('user')
      .countDocuments({
        username: username,
        org: org,
      });
    return existence > 0;
  }
}
