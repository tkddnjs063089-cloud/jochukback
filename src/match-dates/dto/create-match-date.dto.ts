import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateMatchDateDto {
  @ApiProperty({
    description: '경기 날짜/시간',
    example: '2026-01-05T09:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty({ message: '경기 날짜는 필수 입력 항목입니다.' })
  eventDate: string;
}
