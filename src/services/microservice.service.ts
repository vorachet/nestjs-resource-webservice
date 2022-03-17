import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { IServiceResponse } from 'src/interfaces/service-response.interface';

export interface IMicroserviceJob {
  username: string;
  org: string;
  command: string;
  payload: any;
}

@Injectable()
export class MicroserviceService {
  @Client({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  })
  microserviceClient: ClientProxy;

  async callMicroservice(job: IMicroserviceJob): Promise<IServiceResponse> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return new Promise(async function (resolve) {
      that.microserviceClient
        .send(job.command, job.payload)
        .pipe(timeout(10000))
        .toPromise()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.error(error);
          const result: IServiceResponse = {
            message: 'INTERNAL_SERVER_ERROR, ' + error,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            data: null,
            created: new Date().toISOString(),
          };
          resolve(result);
        });
    });
  }
}
