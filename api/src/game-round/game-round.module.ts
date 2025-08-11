import { Module } from '@nestjs/common';
import { GameRoundController } from './game-round.controller';
import { GameRoundService } from './game-round.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoundEntity } from './entities/game-round.entity';
import { QueueModule } from 'src/queue/queue.module';
import { GameModule } from 'src/game/game.module';
import { PriceModule } from 'src/price/price.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameRoundEntity]),
    QueueModule,
    GameModule,
    PriceModule,
    WebsocketsModule,
  ],
  controllers: [GameRoundController],
  providers: [GameRoundService],
  exports: [GameRoundService, TypeOrmModule],
})
export class GameRoundModule {}
