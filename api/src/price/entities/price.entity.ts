import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Price, PriceMarketPair } from '../types';
import type { DecimalString } from 'src/utils/types';

@Entity({
  name: 'price',
})
export class PriceEntity extends BaseEntity implements Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'enum',
    enum: PriceMarketPair,
  })
  marketPair: PriceMarketPair;

  @Column({ type: String })
  price: DecimalString;

  c;
  @Column({ type: 'timestamptz' })
  priceAt: string;

  @CreateDateColumn()
  createdAt: string;
}