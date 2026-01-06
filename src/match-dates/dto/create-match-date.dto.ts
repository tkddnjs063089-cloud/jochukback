import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateMatchDateDto {
  @ApiProperty({ description: '경기 날짜', example: '2026-01-05' })
  @IsDateString()
  @IsNotEmpty({ message: '경기 날짜는 필수 입력 항목입니다.' })
  eventDate: string;

  @ApiProperty({ description: '경기 장소', example: '서울 월드컵 경기장' })
  @IsString()
  @IsNotEmpty({ message: '경기 장소는 필수 입력 항목입니다.' })
  location: string;

  @ApiProperty({ description: '경기 이름', example: '서울 월드컵 경기' })
  @IsString()
  @IsNotEmpty({ message: '경기 이름는 필수 입력 항목입니다.' })
  eventName: string;
}
