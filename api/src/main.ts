import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllConfigType } from './config/types';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from './utils/validation-option';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
  );
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.use(cookieParser());

  app.enableCors({
    origin: configService.getOrThrow('app.corsOrigin', { infer: true }),
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
