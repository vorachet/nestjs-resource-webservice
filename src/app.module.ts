import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicroservicesModule } from './microservices/microservices.module';
import { SecurityModule } from './security/security.module';
import { RestapiModule } from './apps-interfaces/restapi.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    MicroservicesModule,
    SecurityModule,
    RestapiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
