import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationService {
  isValidEmail(emailAddress: string): boolean {
    const regexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regexp.test(emailAddress);
  }
}
