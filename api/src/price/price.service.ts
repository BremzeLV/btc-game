import { Injectable } from '@nestjs/common';

import { Price } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { PriceEntity } from './entities/price.entity';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
  ) {}

    create(dto: Partial<Price>): Promise<Price> {
        return this.priceRepository.save(this.priceRepository.create(dto));
    }

    find(options: FindManyOptions<Price>): Promise<Price[]> {
        return this.priceRepository.find(options);
    }

    findOne(options: FindManyOptions<Price>): Promise<Price | null> { 
        return this.priceRepository.findOne(options);
    }
}
