import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerResourceDto } from './create-customer-resource.dto';

export class UpdateCustomerResourceDto extends PartialType(CreateCustomerResourceDto) {
  id: number;
}
