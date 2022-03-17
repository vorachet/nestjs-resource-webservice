import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { MicroserviceController } from './microservice.controller';
import { v4 as uuidv4 } from 'uuid';
import { IUploadFileJob } from 'src/microservices/file/file.service';
import { IServiceResponse } from 'src/interfaces/service-response.interface';

@Controller('media')
export class MediaController extends MicroserviceController {
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('uploadFileToken') uploadFileToken: string,
    @Body('category') category: string,
  ): Promise<IServiceResponse> {
    category = category ? category : 'undefined';
    const validation = await this.authService.verifyAccessToken({
      accessToken: uploadFileToken,
    });
    if (!validation) {
      return this.controllerService.returnUnAuthorized();
    }

    const objectKey = `${validation.org}/${
      validation.username
    }/file/${category}/${uuidv4()}`;
    const payload: IUploadFileJob = {
      org: validation.org,
      username: validation.username,
      category: category,
      fileName: objectKey,
      file: {
        fieldname: file.fieldname,
        mimetype: file.mimetype,
        buffer: file.buffer,
        size: file.size,
      },
      limitFileSizeInBytes: +process.env.MAX_UPLOAD_FILE_SIZE_BYTES,
    };

    return await this.callMicroservice({
      username: validation.username,
      org: validation.org,
      command: 'uploadFile',
      payload: payload,
    });

    return this.controllerService.returnOk();
  }

  @Post('deleteFile')
  async delete(
    @Body('fileId') fileId: string,
    @Body('deleteFileToken') deleteFileToken: string,
  ) {
    const validation = await this.authService.verifyAccessToken({
      accessToken: deleteFileToken,
    });
    if (!validation) {
      return this.controllerService.returnUnAuthorized();
    }

    return await this.callMicroservice({
      username: validation.username,
      org: validation.org,
      command: 'deleteFile',
      payload: {
        fileId: fileId,
      },
    });
  }
}
