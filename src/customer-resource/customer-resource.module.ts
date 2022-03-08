import { Module } from '@nestjs/common';
import { CustomerResourceService } from './customer-resource.service';
import { CustomerResourceGateway } from './customer-resource.gateway';

@Module({
  providers: [CustomerResourceGateway, CustomerResourceService]
})
export class CustomerResourceModule {}
