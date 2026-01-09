import {
  IsDateString,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMembershipFeeDto {
  @ApiProperty({ description: '선수 이름', example: '홍길동', maxLength: 50 })
  @IsString()
  @MinLength(1, { message: '이름은 최소 2자 이상이어야 합니다.' })
  @MaxLength(50, { message: '이름은 최대 50자 이하여야 합니다.' })
  playerName: string;

  @ApiProperty({ description: '회비 날짜', example: '2026-01-05' })
  @IsDateString()
  @IsNotEmpty({ message: '회비 날짜는 필수 입력 항목입니다.' })
  revenueDate: string;

  @ApiProperty({ description: '회비 금액', example: 100000 })
  @IsNumber()
  @IsNotEmpty({ message: '회비 금액는 필수 입력 항목입니다.' })
  amount: number;

  @ApiProperty({ description: '회비 개월 수', example: 12 })
  @IsNumber()
  @IsNotEmpty({ message: '회비 개월 수는 필수 입력 항목입니다.' })
  monthCount: number;
}
