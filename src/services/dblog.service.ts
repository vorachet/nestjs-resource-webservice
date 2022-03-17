import { Injectable } from '@nestjs/common';
import { MongoService } from 'src/services/mongo.service';

export interface IDBLog {
  username: string;
  org: string;
  serviceName: string;
  created: Date;
}

export interface IErrorLog {
  username: string;
  org: string;
  serviceName: string;
  error: string;
  category: string;
  created: Date;
}

@Injectable()
export class DBLogService {
  constructor(private readonly mongoService: MongoService) {}

  async logServicePerformed(log: IDBLog) {
    return await this.mongoService
      .getCollection('service_performed')
      .insertOne(log);
  }

  async logError(log: IErrorLog) {
    return await this.mongoService
      .getCollection('error_detected')
      .insertOne(log);
  }
}
