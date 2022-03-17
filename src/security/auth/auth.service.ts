import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoService } from 'src/services/mongo.service';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { MicroserviceService } from 'src/services/microservice.service';
import { GeneratorService } from 'libs/generator/src';

export interface IUserLoginRequest {
  role: EUserRole;
  username: string;
  password: string;
  org: string;
}

export interface IEmailVerificationRequest {
  role: EUserRole;
  username: string;
  password: string;
  org: string;
  email: string;
}

export interface IEmailVerificationResponse {
  done: boolean;
  message: string;
}

export interface IAdminLoginRequest {
  secret: string;
}

export interface IAccessTokenVerificationRequest {
  accessToken: string;
}

export enum EUserRole {
  USER = 'user',
  USERADMIN = 'useradmin',
}
export interface ILoginCodeRequest {
  role: EUserRole;
  org: string;
  username: string;
}

export interface ILoginCodeResponse {
  done: boolean;
  message: string;
}

@Injectable()
export class AuthService {
  @Client({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  })
  microserviceClient: ClientProxy;

  constructor(
    private generatorService: GeneratorService,
    private microserviceService: MicroserviceService,
    private jwtService: JwtService,
    private mongoService: MongoService,
  ) {}

  async requestEmailVerification(
    payload: IEmailVerificationRequest,
  ): Promise<IEmailVerificationResponse> {
    const user = await this.mongoService.getCollection(payload.role).findOne({
      org: payload.org,
      username: payload.username,
      password: payload.password,
    });

    if (!user)
      return {
        done: false,
        message: 'Unauthorized',
      };

    const emailVerificationCode = this.generatorService.generateText(5);
    const updateJob = await this.mongoService.getCollection('user').updateOne(
      {
        org: payload.org,
        username: payload.username,
      },
      {
        $set: {
          emailVerified: false,
          emailVerificationCode: emailVerificationCode,
          emailVerificationCodeCreated: new Date(),
          email: payload.email,
        },
      },
    );

    if (!updateJob.acknowledged)
      return {
        done: false,
        message: 'Unable to update email',
      };

    const sendMailJobResp = await this.microserviceService.callMicroservice({
      username: payload.username,
      org: payload.org,
      command: 'sendMail',
      payload: {
        to: user.email,
        subject: 'Email Verification Code',
        body: `
        <h3>Email Verification Code= ${emailVerificationCode}</h3>
        `,
      },
    });

    if (sendMailJobResp.statusCode !== HttpStatus.OK) {
      return {
        done: false,
        message: 'Unable to send Email Verification Code',
      };
    }

    return {
      done: true,
      message: 'Email Verification Code has been sent',
    };
  }

  async requestEmailLoginCode(
    payload: ILoginCodeRequest,
  ): Promise<ILoginCodeResponse> {
    const user = await this.mongoService.getCollection(payload.role).findOne({
      org: payload.org,
      username: payload.username,
    });

    if (!user)
      return {
        done: false,
        message: 'User not found',
      };

    if (!user.email || !user.emailVerified) {
      return {
        done: false,
        message: 'Email is not verified yet',
      };
    }

    const loginCode = this.generatorService.generateText(5);

    this.mongoService.getCollection('user').updateOne(
      {
        org: payload.org,
        username: payload.username,
      },
      {
        $set: {
          loginCode: loginCode,
          loginCodeCreated: new Date(),
        },
      },
    );

    const sendMailJobResp = await this.microserviceService.callMicroservice({
      username: payload.username,
      org: payload.org,
      command: 'sendMail',
      payload: {
        to: user.email,
        subject: 'Your Login code',
        body: `
        <h3>LOGIN CODE = ${loginCode}</h3>
        `,
      },
    });

    if (sendMailJobResp.statusCode !== HttpStatus.OK) {
      return {
        done: false,
        message: 'Unable to send Login Code',
      };
    }

    return {
      done: true,
      message: 'Login Code has been sent',
    };
  }

  async userLogin(req: IUserLoginRequest): Promise<any> {
    const user = await this.mongoService.getCollection('user').findOne({
      username: req.username,
      password: req.password,
      role: 'user',
      org: req.org,
    });
    if (!user) {
      return {
        data: null,
      };
    }

    return {
      data: this.jwtService.sign({
        username: user.username,
        userid: user._id,
        role: user.role,
        org: user.org,
        created: new Date().toISOString(),
      }),
    };
  }

  async userAdminLogin(req: IUserLoginRequest): Promise<any> {
    const user: any = await this.mongoService.getCollection('user').findOne({
      username: req.username,
      password: req.password,
      role: 'useradmin',
      org: req.org,
    });

    if (!user) {
      return {
        data: null,
      };
    }

    return {
      data: this.jwtService.sign({
        username: user.username,
        userid: user._id,
        role: user.role,
        org: user.org,
        created: new Date().toISOString(),
      }),
    };
  }

  async adminLogin(adminLoginDto: IAdminLoginRequest): Promise<any> {
    if (adminLoginDto.secret === process.env.ADMIN_SECRET) {
      return {
        data: this.jwtService.sign({
          role: 'admin',
          created: new Date().toISOString(),
        }),
      };
    }
    return {
      data: null,
    };
  }

  async verifyAccessToken(
    request: IAccessTokenVerificationRequest,
  ): Promise<any> {
    try {
      /*
      {
        "role": "VALUE",
        "created": "2022-03-12T13:52:07.288Z",
        "iat": 1647093127,
        "exp": 1647093187,
      }
      */
      return await this.jwtService.verifyAsync(request.accessToken);
    } catch (error) {
      return null;
    }
  }
}
