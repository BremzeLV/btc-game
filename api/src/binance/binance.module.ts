import { DynamicModule, Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { PriceModule } from 'src/price/price.module';

import { BinanceModuleOptions, MARKET_PAIR_BINDING_KEY, WS_URL_BINDING_KEY } from './types';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({})
export class BinanceModule {
  static register(options: BinanceModuleOptions): DynamicModule {
    return {
      module: BinanceModule,
      imports: [PriceModule, WebsocketsModule],
      providers: [
        BinanceService,
        {
            provide: WS_URL_BINDING_KEY,
            useValue: options.wsUrl,
        },
        {
            provide: MARKET_PAIR_BINDING_KEY,
            useValue: options.marketPair,
        }
      ],
      exports: [BinanceService],
    };
  }
}