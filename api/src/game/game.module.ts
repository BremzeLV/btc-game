import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './entities/game.entity';
import { GameRoundModule } from 'src/game-round/game-round.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity]),
    forwardRef(() => GameRoundModule),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService, TypeOrmModule],
})
export class GameModule {}
