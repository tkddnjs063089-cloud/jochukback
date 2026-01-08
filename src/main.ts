import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의된 필드만 허용 (나머지는 자동 제거)
      transform: true, // 타입 자동 변환
      // forbidNonWhitelisted: true, // 제거: 불필요한 필드가 와도 에러 대신 무시
    }),
  );

  // app.use(
  // rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15분
  //   max: 100, // 15분 동안 최대 100개의 요청
  // }),
  // );

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('조축 API')
    .setDescription('조축 풋살 관리 시스템 API 문서')
    .setVersion('1.0')
    .addTag('players', '선수 관리')
    .addTag('match-dates', '경기 일정 관리')
    .addTag('matches', '경기 관리')
    .addTag('match-records', '경기 기록 관리')
    .addTag('teams', '팀 관리')
    .addTag('expenses', '경비 관리')
    .addTag('membershipfees', '회비 관리')
    .addTag('team-players', '팀 선수 관리')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(Number(process.env.PORT) || 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/api`);
}
bootstrap();
