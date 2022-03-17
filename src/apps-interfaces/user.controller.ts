import { Body, Controller, Post, Headers, Get, Logger } from '@nestjs/common';
import { IUserTokenInfo } from 'src/interfaces/basic-usertoken-info.interface';
import { IServiceResponse } from 'src/interfaces/service-response.interface';
import { MicroserviceController } from './microservice.controller';

@Controller('user')
export class UserController extends MicroserviceController {
  private readonly logger = new Logger(UserController.name);

  async getTokenValidation(
    authorizationHeaderValue: string,
  ): Promise<IUserTokenInfo> {
    const header = authorizationHeaderValue.split(' ');
    const validation = await this.authService.verifyAccessToken({
      accessToken: header.length == 2 ? header[1] : '',
    });
    return validation && validation.role == 'user' ? validation : null;
  }

  @Get('getUserProfile')
  async getUserProfile(
    @Headers('authorization') authorization: string,
  ): Promise<IServiceResponse> {
    this.logger.verbose('getUserProfile');
    const validation = await this.getTokenValidation(authorization);
    if (!validation) {
      return this.controllerService.returnUnAuthorized();
    }

    const user = await this.mongoService.getCollection('user').findOne(
      {
        org: validation.org,
        username: validation.username,
      },
      {
        projection: {
          _id: 0,
          password: 0,
        },
      },
    );

    if (!user) {
      return this.controllerService.returnNotFound('unable to add attr');
    }

    return this.controllerService.returnOk(user);
  }

  @Post('addUserAttr')
  async addUserAttr(
    @Headers('authorization') authorization: string,
    @Body('attrName') attrName: string,
    @Body('attrType') attrType: string,
    @Body('attrValue') attrValue: string,
  ): Promise<IServiceResponse> {
    const validation = await this.getTokenValidation(authorization);
    if (!validation) {
      return this.controllerService.returnUnAuthorized();
    }

    const containsEmptyString =
      attrName.length === 0 || attrType.length === 0 || attrValue.length === 0;

    if (containsEmptyString) {
      return this.controllerService.returnBadRequest('param cannot be empty');
    }

    const result = await this.mongoService.getCollection('user').updateOne(
      {
        org: validation.org,
        username: validation.username,
      },
      {
        $set: this.controllerService.getFieldToBeUpdated(
          attrName,
          attrType,
          attrValue,
        ),
      },
    );

    if (!result.acknowledged) {
      return this.controllerService.returnBadRequest('unable to add attr');
    }

    return this.controllerService.returnOk(null);
  }
}
