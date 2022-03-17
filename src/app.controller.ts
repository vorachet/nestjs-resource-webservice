import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { AppService } from './app.service';
import { AuthGuard } from './security/auth.guard';
import { AuthService } from './security/auth/auth.service';

@Controller()
export class AppController {
  @Client({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  })
  microserviceClient: ClientProxy;
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Post(':operation')
  @UseGuards(AuthGuard)
  send(@Param('operation') operation: string, @Body() payload: any) {
    return this.microserviceClient.send(operation, payload).pipe(timeout(5000));
  }
}
