import { Test, TestingModule } from '@nestjs/testing';
import { CustomerResourceGateway } from './customer-resource.gateway';
import { CustomerResourceService } from './customer-resource.service';

describe('CustomerResourceGateway', () => {
  let gateway: CustomerResourceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerResourceGateway, CustomerResourceService],
    }).compile();

    gateway = module.get<CustomerResourceGateway>(CustomerResourceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
