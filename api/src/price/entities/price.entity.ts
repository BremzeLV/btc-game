import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({
    type: 'enum',
    enum: PriceMarketPair,
  })
  marketPair: PriceMarketPair;

  @Column({ type: String })
  price: DecimalString;

  @Column({ type: 'timestamptz' })
  priceAt: string;

  @CreateDateColumn()
  createdAt: string;
}