import { Injectable } from '@nestjs/common';
import { CreateCustomerResourceDto } from './dto/create-customer-resource.dto';
import { UpdateCustomerResourceDto } from './dto/update-customer-resource.dto';

@Injectable()
export class CustomerResourceService {
  create(createCustomerResourceDto: CreateCustomerResourceDto) {
    return 'This action adds a new customerResource';
  }

  findAll() {
    return `This action returns all customerResource`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customerResource`;
  }

  update(id: number, updateCustomerResourceDto: UpdateCustomerResourceDto) {
    return `This action updates a #${id} customerResource`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerResource`;
  }
}
