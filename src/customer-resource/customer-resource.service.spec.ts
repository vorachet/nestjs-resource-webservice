import { Test, TestingModule } from '@nestjs/testing';
import { CustomerResourceService } from './customer-resource.service';

describe('CustomerResourceService', () => {
  let service: CustomerResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerResourceService],
    }).compile();

    service = module.get<CustomerResourceService>(CustomerResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
