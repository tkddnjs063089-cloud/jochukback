import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ description: '지출 날짜', example: '2026-01-05' })
  @IsDateString()
  @IsNotEmpty({ message: '지출 날짜는 필수 입력 항목입니다.' })
  expenseDate: string;

  @ApiProperty({ description: '금액', example: 50000 })
  @IsNumber()
  @IsNotEmpty({ message: '금액은 필수 입력 항목입니다.' })
  amount: number;

  @ApiProperty({ description: '카테고리', example: '장비' })
  @IsString()
  @IsNotEmpty({ message: '카테고리는 필수 입력 항목입니다.' })
  category: string;

  @ApiProperty({ description: '월 지출 횟수', example: 50000 })
  @IsNumber()
  @IsNotEmpty({ message: '월 지출 금액은 필수 입력 항목입니다.' })
  monthCount: number;

  @ApiPropertyOptional({
    description: '지출 내역 설명',
    example: '지출 내역 설명',
    default: '',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '지출 내역 설명은 필수 입력 항목입니다.' })
  description?: string = '';
}
