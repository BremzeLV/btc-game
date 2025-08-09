import { DatabaseConfig } from "src/database/config/types";

export type AppConfig = {
  nodeEnv: string;
  name: string;
  port: number;
  apiPrefix: string;
  corsOrigin: string;
  jwtSecret: string;
  binanceWsUrl: string;
};

export type AllConfigType = {
    app: AppConfig;
    database: DatabaseConfig;
};