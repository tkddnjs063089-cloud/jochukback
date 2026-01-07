import {
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMatchRecordDto {
  @ApiProperty({ description: '선수 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '플레이어 ID는 필수 입력 항목입니다.' })
  playerId: number;

  @ApiPropertyOptional({ description: '팀 ID', example: 1 })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiPropertyOptional({
    description: '경기 날짜 (ISO 문자열 또는 타임스탬프)',
    example: '2026-01-05T09:00:00.000Z',
  })
  @IsOptional()
  dateId?: string | number; // 프론트에서 timestamp(숫자) 또는 ISO string 둘 다 허용

  @ApiPropertyOptional({
    description: '출석 여부',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  attendance?: boolean = false;

  // 프론트엔드 호환: goal (단수)
  @ApiPropertyOptional({ description: '골 수 (프론트 호환)', example: 0 })
  @IsNumber()
  @IsOptional()
  goal?: number;

  // 백엔드 기존: goals (복수)
  @ApiPropertyOptional({ description: '골 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional()
  goals?: number = 0;

  // 프론트엔드 호환: assist (단수)
  @ApiPropertyOptional({ description: '어시스트 수 (프론트 호환)', example: 0 })
  @IsNumber()
  @IsOptional()
  assist?: number;

  // 백엔드 기존: assists (복수)
  @ApiPropertyOptional({ description: '어시스트 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional()
  assists?: number = 0;

  @ApiPropertyOptional({ description: '클린시트 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional()
  cleanSheet?: number = 0;

  @ApiPropertyOptional({
    description: 'MOM',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  mom?: number = 0;

  @ApiPropertyOptional({ description: '승리 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional()
  wins?: number = 0;

  @ApiPropertyOptional({ description: '무승부 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional()
  draws?: number = 0;

  @ApiPropertyOptional({ description: '패배 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional()
  losses?: number = 0;
}
