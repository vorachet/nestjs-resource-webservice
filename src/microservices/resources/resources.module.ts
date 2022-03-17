import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { MongoService } from 'src/services/mongo.service';
import { SecurityModule } from 'src/security/security.module';
import { ResourcesWSGateway } from './resources.wsgateway';

@Module({
  imports: [SecurityModule],
  controllers: [ResourcesController],
  providers: [ResourcesService, MongoService, ResourcesWSGateway],
})
export class ResourcesModule {}
