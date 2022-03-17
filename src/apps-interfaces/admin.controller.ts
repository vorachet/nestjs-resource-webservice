import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { IServiceResponse } from 'src/interfaces/service-response.interface';
import { AdminGuard } from './admin.guard';
import { MicroserviceController } from './microservice.controller';

@Controller('admin')
export class AdminController extends MicroserviceController {
  private readonly logger = new Logger(AdminController.name);

  @Post('createNewOrg')
  @UseGuards(AdminGuard)
  async createNewOrg(@Body('org') org: string): Promise<IServiceResponse> {
    const containsEmptyString = org.length === 0;
    if (containsEmptyString) {
      return this.controllerService.returnBadRequest('param cannot be empty');
    }

    if (await this.isOrgExist(org)) {
      return this.controllerService.returnBadRequest('org already exist');
    }

    const orgInsertOneResult = await this.mongoService
      .getCollection('org')
      .insertOne({
        org: org,
        created: new Date(),
      });

    if (!orgInsertOneResult.acknowledged) {
      return this.controllerService.returnBadRequest(
        'unable to create new org',
      );
    }

    return this.controllerService.returnOk(null);
  }

  @Post('createNewOrgUserAdmin')
  @UseGuards(AdminGuard)
  async createNewOrgUserAdmin(
    @Body('org') org: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<IServiceResponse> {
    const containsEmptyString = username.length === 0 || password.length === 0;
    if (containsEmptyString) {
      return this.controllerService.returnBadRequest('param cannot be empty');
    }

    if (!(await this.isOrgExist(org))) {
      return this.controllerService.returnBadRequest('org does not exist');
    }

    if (await this.isOrgUsernameExist(org, username)) {
      return this.controllerService.returnBadRequest('username already exist');
    }

    const dbResp = await this.mongoService.getCollection('user').insertOne({
      org: org,
      role: 'useradmin',
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
  @UseGuards(AdminGuard)
  async addOrgAttr(
    @Body('attrOrg') attrOrg: string,
    @Body('attrName') attrName: string,
    @Body('attrType') attrType: string,
    @Body('attrValue') attrValue: string,
  ): Promise<IServiceResponse> {
    const containsEmptyString =
      attrOrg.length === 0 ||
      attrName.length === 0 ||
      attrType.length === 0 ||
      attrValue.length === 0;

    if (containsEmptyString) {
      return this.controllerService.returnBadRequest('param cannot be empty');
    }

    const result = await this.mongoService.getCollection('org').updateOne(
      {
        org: attrOrg,
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

  @Post('addOrgAdminUser')
  @UseGuards(AdminGuard)
  async addOrgAdminUser(
    @Body('org') org: string,
    @Body('username') username: string,
  ): Promise<IServiceResponse> {
    const containsEmptyString = org.length === 0 || username.length === 0;
    if (containsEmptyString)
      return this.controllerService.returnBadRequest('param cannot be empty');

    const user = await this.mongoService.getCollection('user').findOne({
      org: org,
      username: username,
    });

    if (!user)
      return this.controllerService.returnBadRequest('user does not exist');

    const result = await this.mongoService.getCollection('org').updateOne(
      {
        org: org,
      },
      {
        $addToSet: {
          adminUsers: {
            _id: user._id,
            username: user.username,
          },
        },
      },
    );

    if (!result.acknowledged)
      return this.controllerService.returnBadRequest('unable to add attr');

    return this.controllerService.returnOk(null);
  }

  @Post('removeOrgAdminUser')
  @UseGuards(AdminGuard)
  async removeOrgAdminUser(
    @Body('org') org: string,
    @Body('username') username: string,
  ): Promise<IServiceResponse> {
    const containsEmptyString = org.length === 0 || username.length === 0;
    if (containsEmptyString)
      return this.controllerService.returnBadRequest('param cannot be empty');

    const user = await this.mongoService.getCollection('user').findOne({
      org: org,
      username: username,
    });

    if (!user)
      return this.controllerService.returnBadRequest('user does not exist');

    const result = await this.mongoService.getCollection('org').updateOne(
      {
        org: org,
      },
      {
        $pull: {
          adminUsers: {
            _id: user._id,
            username: user.username,
          },
        },
      },
    );

    if (!result.acknowledged)
      return this.controllerService.returnBadRequest('unable to add attr');

    return this.controllerService.returnOk(null);
  }

  @Post('addOrgUserAttr')
  @UseGuards(AdminGuard)
  async addOrgUserAttr(
    @Body('attrOrg') attrOrg: string,
    @Body('attrOrgUsername') attrOrgUsername: string,
    @Body('attrName') attrName: string,
    @Body('attrType') attrType: string,
    @Body('attrValue') attrValue: string,
  ): Promise<IServiceResponse> {
    const containsEmptyString =
      attrOrg.length === 0 ||
      attrOrgUsername.length === 0 ||
      attrName.length === 0 ||
      attrType.length === 0 ||
      attrValue.length === 0;

    if (containsEmptyString) {
      return this.controllerService.returnBadRequest('param cannot be empty');
    }

    const result = await this.mongoService.getCollection('user').updateOne(
      {
        org: attrOrg,
        username: attrOrgUsername,
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

  @Get('listOrgs')
  @UseGuards(AdminGuard)
  async listOrgs(): Promise<IServiceResponse> {
    return this.controllerService.returnOk(
      await this.mongoService.getCollection('org').find({}).toArray(),
    );
  }

  @Post('listOrgUsers')
  @UseGuards(AdminGuard)
  async listOrgUsers(@Body('org') org: string): Promise<IServiceResponse> {
    return this.controllerService.returnOk(
      await this.mongoService
        .getCollection('user')
        .find(
          {
            org: org,
          },
          {
            projection: {
              password: 0,
            },
          },
        )
        .toArray(),
    );
  }
}
