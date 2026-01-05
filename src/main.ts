import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.PORT) || 3000);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'],
    credentials: true,
  });
}
bootstrap();
