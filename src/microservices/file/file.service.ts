import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { MongoService } from 'src/services/mongo.service';

export interface IUploadFileJob {
  fileName: string;
  org: string;
  username: string;
  category: string;
  file: IFile;
  limitFileSizeInBytes: number;
}

export interface IFile {
  fieldname: string;
  mimetype: string;
  buffer: any;
  size: number;
}

export interface IUploadFileJobResponse {
  done: boolean;
  message: string;
  contentUrl: string;
}

export interface IDeleteFileJob {
  fileId: string;
}

export interface IDeleteFileJobResponse {
  done: boolean;
  message: string;
}

const s3 = new AWS.S3({
  s3ForcePathStyle: true,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  endpoint: process.env.AWS_S3_ENDPOINT,
});

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(private readonly mongoService: MongoService) {}

  async upload(payload: IUploadFileJob): Promise<IUploadFileJobResponse> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return new Promise(async function (resolve) {
      const file = payload.file;
      const sizeInBytes = file.size;
      const exceedFileLimit = sizeInBytes > payload.limitFileSizeInBytes;
      if (exceedFileLimit) {
        const message =
          'Exceed media file size limit. Please choose a media file <= ' +
          payload.limitFileSizeInBytes / 1000000 +
          ' MB';
        const result: IUploadFileJobResponse = {
          done: true,
          message: message,
          contentUrl: null,
        };
        resolve(result);
      }

      try {
        const response = await s3
          .upload({
            ACL: process.env.AWS_S3_ACL,
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: payload.fileName,
            Body: Buffer.from(file.buffer.data, 'binary'),
            ContentType: file.mimetype,
          })
          .promise();
        const contentUrl = response.Location;
        const dbTaskResp = await that.mongoService
          .getCollection('file')
          .insertOne({
            org: payload.org,
            username: payload.username,
            category: payload.category,
            mimetype: file.mimetype,
            size: file.size,
            objectKey: payload.fileName,
            contentUrl: contentUrl,
          });

        if (!dbTaskResp.acknowledged) {
          return resolve({
            done: false,
            message: 'Unable to write data',
            contentUrl: response.Location,
          });
        }

        const result: IUploadFileJobResponse = {
          done: true,
          message: 'File has been uploaded',
          contentUrl: response.Location,
        };
        resolve(result);
      } catch (e) {
        console.error(e);
        const result: IUploadFileJobResponse = {
          done: false,
          message: 'Unable to upload file',
          contentUrl: null,
        };
        resolve(result);
      }
    });
  }

  async delete(payload: IDeleteFileJob): Promise<IDeleteFileJobResponse> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return new Promise(async function (resolve) {
      const file = await that.mongoService.getCollection('file').findOne({
        _id: that.mongoService.ObjectId(payload.fileId),
      });
      if (!file) {
        return resolve({
          done: false,
          message: 'File not found',
        });
      }

      try {
        const s3Job = await s3
          .deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: file.objectKey,
          })
          .promise();

        const deleteTaskResp = await that.mongoService
          .getCollection('file')
          .deleteOne({
            _id: that.mongoService.ObjectId(payload.fileId),
          });
        if (!deleteTaskResp.acknowledged) {
          return resolve({
            done: false,
            message: 'Unable to delete file on db',
          });
        }

        if (!s3Job) {
          return resolve({
            done: false,
            message: 'Unable to delete file on cloud',
          });
        }

        return resolve({
          done: true,
          message: 'File has been deleted',
        });
      } catch (e) {
        that.logger.error('delete error = ', e);
        const result: IDeleteFileJobResponse = {
          done: false,
          message: 'Unable to delete file',
        };
        return resolve(result);
      }
    });
  }
}
