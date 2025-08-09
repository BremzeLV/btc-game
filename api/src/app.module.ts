import { MiddlewareConsumer, Module } from '@nestjs/common';
import appConfig from './config/app-config';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/config/database.config';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoundModule } from './game-round/game-round.module';
import { BinanceModule } from './binance/binance.module';
import { PriceMarketPair } from './price/types';
import { QueueModule } from './queue/queue.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AnonymousUserMiddleware } from './middleware/annonymous-user.middleware';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    QueueModule,
    GameRoundModule,
    BinanceModule.register({
      marketPair: PriceMarketPair.BTCUSD,
      wsUrl: process.env.BINANCE_WS_URL ?? '',
    }),
    WebsocketsModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AnonymousUserMiddleware)
      .forRoutes('/game/findOrStartNewGame');
  }
}
