import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game-round.controller';
import { GameService } from './game-round.service';

describe('GameController', () => {
  let appController: GameController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService],
    }).compile();

    appController = app.get<GameController>(GameController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
