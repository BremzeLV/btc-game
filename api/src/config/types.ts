import { DatabaseConfig } from "src/database/config/types";

export type AppConfig = {
  nodeEnv: string;
  name: string;
  port: number;
  apiPrefix: string;
  corsOrigin: string;
  jwtSecret: string;
  binanceWsUrl: string;
  redisHost: string;
  redisPort: string;
  gameRoundLenghtMiliseconds: number;
  priceUpdateThrottle: number;
};

export type AllConfigType = {
    app: AppConfig;
    database: DatabaseConfig;
};