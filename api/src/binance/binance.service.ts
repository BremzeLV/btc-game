import WebSocket from 'ws';
import Big from 'big.js';

import {
  Injectable,
  OnModuleInit,
  Logger,
  Inject,
  OnModuleDestroy,
} from '@nestjs/common';
import { PriceService } from 'src/price/price.service';
import { PriceMarketPair } from 'src/price/types';

import {
  BinanceTickerWsMessage,
  MARKET_PAIR_BINDING_KEY,
  WS_URL_BINDING_KEY,
} from './types';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { throttle } from 'lodash';

@Injectable()
export class BinanceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BinanceService.name);

  private ws: WebSocket;
  private reconnectDelay = 5000;
  private priceUpdateThrottling = 0;

  constructor(
    private readonly priceService: PriceService,
    @Inject(WS_URL_BINDING_KEY) private readonly wsUrl: string,
    @Inject(MARKET_PAIR_BINDING_KEY)
    private readonly marketPair: PriceMarketPair,
    private readonly websocketsService: WebsocketsService,
  ) {}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.disconnect();
  }

  private async handleMessage(data: string) {
    const tick: BinanceTickerWsMessage = JSON.parse(data);

    const price = await this.priceService.create({
      price: Big(tick.c).toString(),
      priceAt: new Date(tick.E).toISOString(),
      marketPair: this.marketPair,
    });

    this.websocketsService.broadcastPriceUpdate(price);
  }

  private onOpen() {
    this.ws.on('open', () => {
      this.logger.log(`Opened connection with Binance WS "${this.marketPair}"`);
    });
  }

  private onMessage() {
    const throttledHandler = throttle(
      async (data: string) => this.handleMessage(data),
      this.priceUpdateThrottling,
    );

    this.ws.on('message', throttledHandler);
  }

  private onClose() {
    this.ws.on('close', () => {
      this.reconnect();
    });
  }

  private onError() {
    this.ws.on('error', (err) => {
      this.logger.error(
        `Connection error to Binance WS "${this.marketPair}": ${err.message}`,
      );
      this.disconnect();
    });
  }

  private connect() {
    this.ws = new WebSocket(this.wsUrl);

    this.onOpen();
    this.onMessage();
    this.letsPlayPingPong();
    this.onClose();
    this.onError();
  }

  private disconnect() {
    this.ws.close();
  }

  private letsPlayPingPong() {
    this.ws.on('ping', (payload) => {
      this.logger.debug(
        `Playing Ping-Pong, sending Pong to Binance WS "${this.marketPair}"`,
      );
      this.ws.pong(payload);
    });
  }

  private reconnect() {
    setTimeout(() => {
      this.logger.log(`Reconnecting to Binance WS "${this.marketPair}"`);
      this.connect();
    }, this.reconnectDelay);
  }
}
