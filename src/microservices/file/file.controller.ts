import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IServiceResponse } from 'src/interfaces/service-response.interface';
import {
  FileService,
  IDeleteFileJob,
  IDeleteFileJobResponse,
  IUploadFileJob,
  IUploadFileJobResponse,
} from './file.service';

@Controller()
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly fileService: FileService) {}

  @MessagePattern('uploadFile')
  async upload(@Payload() payload: IUploadFileJob): Promise<IServiceResponse> {
    const resp: IUploadFileJobResponse = await this.fileService.upload(payload);

    if (resp.done) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: resp.contentUrl,
        created: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'INTERNAL_SERVER_ERROR',
      data: null,
      created: new Date().toISOString(),
    };
  }

  @MessagePattern('deleteFile')
  async delete(@Payload() payload: IDeleteFileJob): Promise<IServiceResponse> {
    const resp: IDeleteFileJobResponse = await this.fileService.delete(payload);
    if (resp.done) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: null,
        created: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'INTERNAL_SERVER_ERROR',
      data: null,
      created: new Date().toISOString(),
    };
  }
}
