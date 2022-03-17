import { Injectable } from '@nestjs/common';
import { ValidationService } from 'libs/validation/src';
import * as nodemailer from 'nodemailer';

export interface IEmailJob {
  to: string;
  subject: string;
  body: string;
}

export interface IEmailJobResponse {
  done: boolean;
  message: string;
}

@Injectable()
export class EmailService {
  constructor(private validationService: ValidationService) {}
  async sendMail(payload: IEmailJob) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return new Promise(function (resolve) {
      if (!that.validationService.isValidEmail(payload.to)) {
        resolve({
          done: false,
          message: 'invalid email address',
        });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: payload.to,
        subject: payload.subject,
        html: payload.body,
      };
      transporter.sendMail(mailOptions, (err) => {
        resolve({
          done: err ? false : true,
          message: err ? 'Unable to send mail' : 'Mail has been sent',
        });
      });
    });
  }
}
