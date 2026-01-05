import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({ description: '경기 날짜', example: '2026-01-05' })
  @IsDateString()
  @IsNotEmpty({ message: '날짜는 필수 입력 항목입니다.' })
  matchDate: string;

  @ApiProperty({ description: '경기 순서', example: 1, minimum: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '순서는 필수 입력 항목입니다.' })
  @Min(1, { message: '순서는 1 이상이어야 합니다.' })
  matchOrder: number;

  @ApiProperty({ description: '팀 타입', example: 'PINK', enum: ['PINK', 'BLACK'], default: 'PINK' })
  @IsString()
  @IsIn(['PINK', 'BLACK'], { message: '팀 타입은 PINK 또는 BLACK여야 합니다.' })
  teamType: 'PINK' | 'BLACK' = 'PINK';
}
