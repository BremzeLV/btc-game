import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { JobDataName, JobDataType, QueueName } from "../types";
import { Logger } from "@nestjs/common";
import { GameRoundService } from "src/game-round/game-round.service";

@Processor(QueueName.GameQueue)
export class GameConsumer extends WorkerHost {
  private readonly logger = new Logger(GameConsumer.name);

  constructor(private readonly gameRoundService: GameRoundService) { super() }

  async process(job: Job<JobDataType, void, JobDataName>): Promise<void> {
    this.logger.debug(`Processing job: ${job.name}`);

    try {
      await this.gameRoundService.resolveRound(job.data);
    } catch (e: unknown) { 
      this.gameRoundService.cancelRound(job.data);
      this.logger.error('Game round resolvment has been unsuccesfull', e);
    }
  }
}