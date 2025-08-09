import { Module } from '@nestjs/common';

import { WebsocketsService } from './websockets.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WebsocketsService],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}
