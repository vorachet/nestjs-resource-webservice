import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerResourceModule } from './customer-resource/customer-resource.module';

@Module({
  imports: [CustomerResourceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
