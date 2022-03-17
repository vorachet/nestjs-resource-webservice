import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { IServiceResponse } from 'src/interfaces/service-response.interface';
import {
  AuthService,
  IUserLoginRequest,
  IAdminLoginRequest,
  ILoginCodeRequest,
  IAccessTokenVerificationRequest,
  IEmailVerificationRequest,
  IEmailVerificationResponse,
} from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private acceptedUserRoles = [];

  constructor(private authService: AuthService) {
    this.acceptedUserRoles = process.env.RESOURCE_NAMES
      ? process.env.RESOURCE_NAMES.split(',')
      : [];
    this.logger.debug('Available User Roles = ' + this.acceptedUserRoles);
  }

  @Post('userLogin')
  async userLogin(@Body() req: IUserLoginRequest): Promise<IServiceResponse> {
    const resp = await this.authService.userLogin(req);
    return {
      data: resp.data ? resp.data : null,
      statusCode: resp.data ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: resp.data ? 'OK' : 'NOT_FOUND',
      created: new Date(),
    };
  }

  @Post('userAdminLogin')
  async userAdminLogin(
    @Body() req: IUserLoginRequest,
  ): Promise<IServiceResponse> {
    const resp = await this.authService.userAdminLogin(req);
    return {
      data: resp.data ? resp.data : null,
      statusCode: resp.data ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: resp.data ? 'OK' : 'NOT_FOUND',
      created: new Date(),
    };
  }

  @Post('adminLogin')
  async adminLogin(@Body() req: IAdminLoginRequest): Promise<IServiceResponse> {
    const resp = await this.authService.adminLogin(req);
    return {
      data: resp.data ? resp.data : null,
      statusCode: resp.data ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: resp.data ? 'OK' : 'NOT_FOUND',
      created: new Date(),
    };
  }

  @Post('verifyAccessToken')
  async verifyAccessToken(@Body() request: IAccessTokenVerificationRequest) {
    const resp = await this.authService.verifyAccessToken(request);
    return {
      data: resp,
      statusCode: resp ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: resp ? 'OK' : 'NOT_FOUND',
      created: new Date(),
    };
  }

  @Post('requestUserEmailVerification')
  async requestUserEmailVerification(
    @Body() payload: IEmailVerificationRequest,
  ): Promise<IServiceResponse> {
    const resp: IEmailVerificationResponse =
      await this.authService.requestEmailVerification(payload);
    return {
      data: null,
      statusCode: resp.done ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
      message: resp.message,
      created: new Date(),
    };
  }

  @Post('requestUserEmailLoginCode')
  async requestUserEmailLoginCode(
    @Body() payload: ILoginCodeRequest,
  ): Promise<IServiceResponse> {
    const resp = await this.authService.requestEmailLoginCode(payload);
    return {
      data: null,
      statusCode: resp.done ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
      message: resp.message,
      created: new Date(),
    };
  }
}
