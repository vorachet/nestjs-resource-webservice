import { Module } from '@nestjs/common';
import { ControllerService } from './controller.service';

@Module({
  providers: [ControllerService],
  exports: [ControllerService],
})
export class ControllerModule {}
