import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe 설정
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'],
    credentials: true,
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('조축 API')
    .setDescription('조축 풋살 관리 시스템 API 문서')
    .setVersion('1.0')
    .addTag('players', '선수 관리')
    .addTag('matches', '경기 관리')
    .addTag('match-records', '경기 기록 관리')
    .addTag('match-dates', '경기 일정 관리')
    .addTag('expenses', '경비 관리')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(Number(process.env.PORT) || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/api`);
}
bootstrap();
