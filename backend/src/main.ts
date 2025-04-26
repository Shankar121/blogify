import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // The origin of your frontend app
    credentials: true, // Allow cookies to be sent with requests
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();
