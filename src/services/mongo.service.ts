import { Injectable, Logger } from '@nestjs/common';
import * as mongoDB from 'mongodb';
import { ObjectId } from 'mongodb';

@Injectable()
export class MongoService {
  private readonly logger = new Logger(MongoService.name);
  isSetupDone = false;
  private client: mongoDB.MongoClient;
  private db: mongoDB.Db;
  public collections = {};

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    process.on('SIGINT', async function () {
      if (that.client) {
        that.client.close(function () {
          console.log(' --> MONGO disconnected on app termination');
          process.exit(0);
        });
      }
    });
    this.setup();
  }

  getCollection(name: string): mongoDB.Collection {
    if (!this.collections[name]) {
      this.collections[name] = this.db.collection(name);
    }
    return this.collections[name];
  }

  setup() {
    if (this.isSetupDone) return;
    this.client = new mongoDB.MongoClient(process.env.MONGO_URL);
    this.client
      .connect()
      .then(async () => {
        this.logger.debug('MongoService connected');
        this.db = this.client.db(process.env.MONGO_DATABASE);
        this.isSetupDone = true;
        this.logger.debug('MongoService ready');
      })
      .catch((error) => {
        this.logger.error('Unable to connect Mongo' + error.message);
      });
  }

  ObjectId(objectIdString?: string) {
    if (objectIdString) {
      return new ObjectId(objectIdString);
    } else {
      return new ObjectId();
    }
  }
}
