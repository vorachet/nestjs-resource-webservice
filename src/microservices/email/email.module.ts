import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ValidationModule } from 'libs/validation/src';

@Module({
  imports: [ValidationModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
