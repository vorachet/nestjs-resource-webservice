import { NestFactory } from '@nestjs/core';
import { TcpOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MicroservicesModule } from './microservices/microservices.module';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const microservices = await NestFactory.createMicroservice(
    MicroservicesModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    } as TcpOptions,
  );
  await microservices.listen();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //app.use(helmet());
  await app.listen(3000);
}
bootstrap();
