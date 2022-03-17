import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { AuthService } from 'src/security/auth/auth.service';
import {
  ICreateCommand,
  IFindAllCommand,
  IFindOneCommand,
  IRemoveCommand,
  IUpdateCommand,
  ResourcesService,
} from './resources.service';

@WebSocketGateway()
export class ResourcesWSGateway {
  private readonly logger = new Logger(ResourcesWSGateway.name);
  constructor(
    private readonly authService: AuthService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @SubscribeMessage('createResource')
  create(
    @MessageBody()
    payload: ICreateCommand,
  ) {
    return this.resourcesService.create(payload);
  }

  @SubscribeMessage('findAllResources')
  findAll(@MessageBody() payload: IFindAllCommand) {
    return this.resourcesService.findAll(payload);
  }

  @SubscribeMessage('findOneResource')
  findOne(@MessageBody() payload: IFindOneCommand) {
    return this.resourcesService.findOne(payload);
  }

  @SubscribeMessage('updateResource')
  update(
    @MessageBody()
    payload: IUpdateCommand,
  ) {
    return this.resourcesService.update(payload);
  }

  @SubscribeMessage('removeResource')
  remove(@MessageBody() payload: IRemoveCommand) {
    return this.resourcesService.remove(payload);
  }
}
