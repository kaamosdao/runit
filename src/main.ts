/* eslint-disable import/no-import-module-exports */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'assets'));
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.enable('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  app.use(cookieParser());
  app.setViewEngine('pug');
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT || 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
