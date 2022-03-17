import { Body, Controller, Post, Headers, Get, Param } from '@nestjs/common';
import { IUserTokenInfo } from 'src/interfaces/basic-usertoken-info.interface';
import { IServiceResponse } from 'src/interfaces/service-response.interface';
import { MicroserviceController } from './microservice.controller';

@Controller('useradmin')
export class UserAdminController extends MicroserviceController {
  async getTokenValidation(
    authorizationHeaderValue: string,
  ): Promise<IUserTokenInfo> {
    const header = authorizationHeaderValue.split(' ');
    const validation = await this.authService.verifyAccessToken({
      accessToken: header.length == 2 ? header[1] : '',
    });
    return validation && validation.role == 'useradmin' ? validation : null;
  }

  @Get('getOrg')
  async getOrg(
    @Headers('authorization') authorization: string,
  ): Promise<IServiceResponse> {
    const validation = await this.getTokenValidation(authorization);
    if (!validation) {
      return this.controllerService.returnUnAuthorized();
    }

    return await this.callMicroservice({
      username: validation.username,
      org: validation.org,
      command: 'findOneResource',
      payload: {
        collection: 'org',
        filter: {
          org: validation.org,
        },
      },
    });
  }

  @Get('getUserProfile/:username')
  async getUserProfile(
    @Headers('authorization') authorization: string,
    @Param('username') username: string,
  ): Promise<IServiceResponse> {
    const validation = await this.getTokenValidation(authorization);
    if (!validation) {
      return this.controllerService.returnUnAuthorized();
    }

    const user = await this.mongoService.getCollection('user').findOne(
      {
        org: validation.org,
        username: username,
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

  @Get('listOrgUsers')
  async listOrgUsers(
    @Headers('authorization') authorization: string,
  ): Promise<IServiceResponse> {
    const validation = await this.getTokenValidation(authorization);
    if (!validation) {
      return this.controllerService.returnUnAuthorized();
    }

    return await this.callMicroservice({
      username: validation.username,
      org: validation.org,
      command: 'findAllResources',
      payload: {
        collection: 'user',
        filter: {
          org: validation.org,
        },
      },
    });
  }

  @Post('createNewOrgUser')
  async createNewOrgUser(
    @Headers('authorization') authorization: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<IServiceResponse> {
    const validation = await this.getTokenValidation(authorization);
    if (!validation) {
      return this.controllerService.returnUnAuthorized();
    }

    const containsEmptyString = username.length === 0 || password.length === 0;
    if (containsEmptyString) {
      return this.controllerService.returnBadRequest('param cannot be empty');
    }

    if (!(await this.isOrgExist(validation.org))) {
      return this.controllerService.returnBadRequest('org does not exist');
    }

    if (await this.isOrgUsernameExist(validation.org, username)) {
      return this.controllerService.returnBadRequest('username already exist');
    }

    const dbResp = await this.mongoService.getCollection('user').insertOne({
      org: validation.org,
      role: 'user',
      username: username,
      password: password,
      created: new Date(),
    });

    const isInserted = dbResp.acknowledged && dbResp.insertedId;
    if (!isInserted) {
      return this.controllerService.returnBadRequest(
        'unable to create new user',
      );
    }

    return this.controllerService.returnOk(null);
  }

  @Post('addOrgAttr')
  async addOrgAttr(
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

    const result = await this.mongoService.getCollection('org').updateOne(
      {
        org: validation.org,
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

  @Post('addUserAttr')
  async addUserAttr(
    @Headers('authorization') authorization: string,
    @Body('username') username: string,
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
        username: username,
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
