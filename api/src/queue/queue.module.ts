import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { QueueName } from './types';
import { GameConsumer } from './consumers/game.consumer';
import { ConfigService } from '@nestjs/config';
import { GameRoundModule } from 'src/game-round/game-round.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QueueName.GameQueue,
    }),
    forwardRef(() => GameRoundModule),
    WebsocketsModule,
  ],
  controllers: [],
  providers: [GameConsumer],
  exports: [GameConsumer, BullModule],
})
export class QueueModule {}
