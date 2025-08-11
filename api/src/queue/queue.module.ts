import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { QueueName } from './types';
import { GameConsumer } from './consumers/game.consumer';
import { ConfigService } from '@nestjs/config';
import { GameRoundModule } from 'src/game-round/game-round.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { AllConfigType, } from 'src/config/types';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        prefix: 'bull:{btcGame}',
        connection: {
          host: configService.getOrThrow('app.redisHost', { infer: true }),
          port: configService.getOrThrow('app.redisPort', { infer: true }),
          tls:
            configService.getOrThrow('app.nodeEnv', { infer: true }) ===
            'production'
              ? {}
              : undefined,
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
