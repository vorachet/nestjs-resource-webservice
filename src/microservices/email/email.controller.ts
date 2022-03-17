import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IServiceResponse } from 'src/interfaces/service-response.interface';
import { EmailService, IEmailJob, IEmailJobResponse } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern('sendMail')
  async sendMail(@Payload() payload: IEmailJob): Promise<IServiceResponse> {
    const resp = (await this.emailService.sendMail(
      payload,
    )) as IEmailJobResponse;
    if (resp.done) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: null,
        created: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: resp.message,
      data: null,
      created: new Date().toISOString(),
    };
  }
}
