import { registerAs } from '@nestjs/config';
import validateConfig from '.././utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AppConfig } from './types';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  APP_NAME: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  APP_PORT: number;

  @IsString()
  API_PREFIX: string;

  @IsString()
  CORS_ORIGIN: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  BINANCE_WS_URL: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    corsOrigin: process.env.CORS_ORIGIN || '',
    jwtSecret: process.env.JWT_SECRET || '',
    binanceWsUrl: process.env.BINANCE_WS_URL || '',
  };
});