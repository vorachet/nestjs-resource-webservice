import { Injectable, Logger } from '@nestjs/common';
import { MongoService } from 'src/services/mongo.service';

export interface ICreateCommand {
  collection: string;
  entity: any;
}

export interface IFindOneCommand {
  collection: string;
  filter: any;
}

export interface IFindAllCommand {
  collection: string;
  filter: any;
}

export interface IUpdateCommand {
  collection: string;
  id: string;
  entityToBeUpdated: any;
}

export interface IRemoveCommand {
  collection: string;
  id: string;
}

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);
  private acceptedCollectionNames = [];

  constructor(private mongoService: MongoService) {
    this.acceptedCollectionNames = process.env.RESOURCE_NAMES
      ? process.env.RESOURCE_NAMES.split(',')
      : [];
    this.logger.debug('Available Resources = ' + this.acceptedCollectionNames);
  }

  isAcceptableCollectionName(name: string) {
    return this.acceptedCollectionNames.includes(name);
  }

  async create(command: ICreateCommand) {
    if (this.isAcceptableCollectionName(command.collection)) {
      return {
        data: await this.mongoService
          .getCollection(command.collection)
          .insertOne(command.entity),
      };
    }

    return {
      data: null,
    };
  }

  async findAll(command: IFindAllCommand) {
    if (this.isAcceptableCollectionName(command.collection)) {
      return await this.mongoService
        .getCollection(command.collection)
        .find(command.filter)
        .toArray();
    }

    return null;
  }

  async findOne(command: IFindOneCommand) {
    if (this.isAcceptableCollectionName(command.collection)) {
      return await this.mongoService
        .getCollection(command.collection)
        .findOne(command.filter);
    }

    return null;
  }

  async update(command: IUpdateCommand) {
    if (this.isAcceptableCollectionName(command.collection)) {
      return {
        data: await this.mongoService
          .getCollection(command.collection)
          .updateOne(
            {
              _id: this.mongoService.ObjectId(command.id),
            },
            {
              $set: command.entityToBeUpdated,
            },
          ),
      };
    }

    return {
      data: null,
    };
  }

  async remove(command: IRemoveCommand) {
    if (this.isAcceptableCollectionName(command.collection)) {
      return {
        data: await this.mongoService
          .getCollection(command.collection)
          .deleteOne({
            _id: this.mongoService.ObjectId(command.id),
          }),
      };
    }

    return {
      data: null,
    };
  }
}
