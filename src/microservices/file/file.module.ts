import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongoService } from 'src/services/mongo.service';

@Module({
  controllers: [FileController],
  providers: [FileService, MongoService],
})
export class FileModule {}
