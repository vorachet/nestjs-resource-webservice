import { Module } from '@nestjs/common';
import { ResourcesModule } from 'src/microservices/resources/resources.module';
import { EmailModule } from './email/email.module';
import { FileModule } from './file/file.module';
@Module({
  imports: [ResourcesModule, EmailModule, FileModule],
})
export class MicroservicesModule {}
