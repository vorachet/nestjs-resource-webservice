import { HttpStatus, Injectable } from '@nestjs/common';
import { IServiceResponse } from 'src/interfaces/service-response.interface';

@Injectable()
export class ControllerService {
  returnBadRequest(message?: string): IServiceResponse {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      data: null,
      message: 'BAD_REQUEST' + (message ? `(${message})` : ''),
      created: new Date().toISOString(),
    };
  }

  returnServiceUnavailable(message?: any): IServiceResponse {
    return {
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      data: null,
      message: 'SERVICE_UNAVAILABLE' + (message ? `(${message})` : ''),
      created: new Date().toISOString(),
    };
  }

  returnNotFound(message?: any): IServiceResponse {
    return {
      statusCode: HttpStatus.NOT_FOUND,
      data: null,
      message: 'NOT_FOUND' + (message ? `(${message})` : ''),
      created: new Date().toISOString(),
    };
  }

  returnOk(data?: any): IServiceResponse {
    return {
      statusCode: HttpStatus.OK,
      data: data,
      message: 'OK',
      created: new Date().toISOString(),
    };
  }

  returnUnAuthorized(message?: string): IServiceResponse {
    return {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'UNAUTHORIZED' + (message ? `(${message})` : ''),
      data: null,
      created: new Date().toISOString(),
    };
  }

  getFieldToBeUpdated(attrName: string, attrType: string, attrValue: string) {
    const fieldsToBeUpdated = {};
    if (attrType === 'string') fieldsToBeUpdated[attrName] = attrValue;
    else if (attrType === 'number') fieldsToBeUpdated[attrName] = +attrValue;
    else if (attrType === 'boolean')
      fieldsToBeUpdated[attrName] = attrValue === 'true';
    else if (attrType === 'timestamp') fieldsToBeUpdated[attrName] = new Date();
    else fieldsToBeUpdated[attrName] = attrValue;
    return fieldsToBeUpdated;
  }
}
