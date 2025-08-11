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
import { Game, GameStatus } from '../types';
import { PriceMarketPair } from 'src/price/types';

@Entity({
  name: 'game',
})
export class GameEntity extends BaseEntity implements Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'uuid',
  })
  userId: string;

  @Column({
    type: Number,
    default: 0,
  })
  points: number;

  @Index()
  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.ONGOING,
  })
  status: GameStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: PriceMarketPair,
  })
  marketPair: PriceMarketPair;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}