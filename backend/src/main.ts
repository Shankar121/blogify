import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('PLATFORM_URL', process.env.PLATFORM_URL);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.PLATFORM_URL,
    credentials: true,
  });
  console.log('Listening on PORT...', process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();
