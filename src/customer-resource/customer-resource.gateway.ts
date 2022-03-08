import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { CustomerResourceService } from './customer-resource.service';
import { CreateCustomerResourceDto } from './dto/create-customer-resource.dto';
import { UpdateCustomerResourceDto } from './dto/update-customer-resource.dto';

@WebSocketGateway()
export class CustomerResourceGateway {
  constructor(
    private readonly customerResourceService: CustomerResourceService,
  ) {}

  @SubscribeMessage('createCustomerResource')
  create(@MessageBody() createCustomerResourceDto: CreateCustomerResourceDto) {
    return this.customerResourceService.create(createCustomerResourceDto);
  }

  @SubscribeMessage('findAllCustomerResource')
  findAll() {
    return this.customerResourceService.findAll();
  }

  @SubscribeMessage('findOneCustomerResource')
  findOne(@MessageBody() id: number) {
    return this.customerResourceService.findOne(id);
  }

  @SubscribeMessage('updateCustomerResource')
  update(@MessageBody() updateCustomerResourceDto: UpdateCustomerResourceDto) {
    return this.customerResourceService.update(
      updateCustomerResourceDto.id,
      updateCustomerResourceDto,
    );
  }

  @SubscribeMessage('removeCustomerResource')
  remove(@MessageBody() id: number) {
    return this.customerResourceService.remove(id);
  }
}
