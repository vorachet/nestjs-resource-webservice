import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IServiceResponse } from 'src/interfaces/service-response.interface';
import { AuthService } from 'src/security/auth/auth.service';
import {
  ICreateCommand,
  IFindAllCommand,
  IFindOneCommand,
  IRemoveCommand,
  IUpdateCommand,
  ResourcesService,
} from './resources.service';

@Controller()
export class ResourcesController {
  constructor(
    private readonly authService: AuthService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @MessagePattern('createResource')
  async create(@Payload() payload: ICreateCommand): Promise<IServiceResponse> {
    const resp = await this.resourcesService.create(payload);
    if (resp.data && resp.data.acknowledged) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: null,
        created: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unable to create new resource',
      data: null,
      created: new Date().toISOString(),
    };
  }

  @MessagePattern('findAllResources')
  async findAll(
    @Payload() payload: IFindAllCommand,
  ): Promise<IServiceResponse> {
    const resp = await this.resourcesService.findAll(payload);
    if (resp == null) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'NOT_FOUND',
        data: null,
        created: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: resp,
      created: new Date().toISOString(),
    };
  }

  @MessagePattern('findOneResource')
  async findOne(
    @Payload() payload: IFindOneCommand,
  ): Promise<IServiceResponse> {
    const resp = await this.resourcesService.findOne(payload);
    if (resp == null) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'NOT_FOUND',
        data: null,
        created: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: resp,
      created: new Date().toISOString(),
    };
  }

  @MessagePattern('updateResource')
  async update(@Payload() payload: IUpdateCommand): Promise<IServiceResponse> {
    const resp = await this.resourcesService.update(payload);
    if (resp.data && resp.data.acknowledged) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: null,
        created: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'NOT_FOUND',
      data: null,
      created: new Date().toISOString(),
    };
  }

  @MessagePattern('removeResource')
  async remove(@Payload() payload: IRemoveCommand): Promise<IServiceResponse> {
    const resp = await this.resourcesService.remove(payload);
    if (resp.data && resp.data.acknowledged) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: null,
        created: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'NOT_FOUND',
      data: null,
      created: new Date().toISOString(),
    };
  }
}
