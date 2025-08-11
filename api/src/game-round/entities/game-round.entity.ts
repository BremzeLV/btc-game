import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameRound, GameRoundPrediction, GameRoundResult } from '../types';

@Entity({
  name: 'game-round',
})
export class GameRoundEntity extends BaseEntity implements GameRound {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'uuid',
  })
  userId: string;

  @Index()
  @Column({
    type: Number,
  })
  gameId: number;

  @Column({
    type: 'enum',
    enum: GameRoundPrediction,
  })
  prediction: GameRoundPrediction;

  @Index()
  @Column({
    type: 'enum',
    enum: GameRoundResult,
    default: GameRoundResult.WAITING,
  })
  result: GameRoundResult;

  @Column({ type: 'timestamptz' })
  roundStartAt: string;

  @Column({ type: 'timestamptz' })
  roundEndAt: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;
}