import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IEmailJob } from 'src/microservices/email/email.service';
import { MicroserviceController } from './microservice.controller';
import { UserGuard } from './user.guard';

@Controller('registration')
export class RegistrationController extends MicroserviceController {
  @Post('verifyUserEmail')
  @UseGuards(UserGuard)
  async verifyUserEmail(@Body('to') to: string) {
    const job: IEmailJob = {
      to: to,
      subject: 'Verify email',
      body: '<p></p>',
    };

    return await this.callMicroservice({
      username: 'undefined',
      org: 'undefined',
      command: 'sendMail',
      payload: job,
    });
  }
}
