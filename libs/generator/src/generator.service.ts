import { Injectable } from '@nestjs/common';
import * as randomstring from 'randomstring';

@Injectable()
export class GeneratorService {
  generateText(length: number) {
    return randomstring.generate({
      length: length > 0 && length < 30 ? length : 5,
    });
  }
}
