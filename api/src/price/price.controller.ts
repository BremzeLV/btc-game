import { Controller, Get, Query } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceFindDto } from './dto/price-find.dto';
import { Price } from './types';
import { Public } from 'src/guards/public.guard';

@Controller({
  path: 'price',
})
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('/')
  @Public()
  async find(@Query() query: PriceFindDto): Promise<Price | null> {
    return this.priceService.findOne({
      where: {
        marketPair: query.marketPair,
      },
      order: {
        priceAt: 'DESC',
      },
    });
  }
}
