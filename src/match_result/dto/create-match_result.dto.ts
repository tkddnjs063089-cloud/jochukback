import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMatchResultDto {
  @ApiProperty({ description: '경기 날짜', example: '2026-01-05' })
  @IsDateString()
  @IsNotEmpty({ message: '날짜는 필수 입력 항목입니다.' })
  dateId: string;

  @ApiProperty({ description: '팀 1 이름', example: '팀 1' })
  @IsString()
  @IsNotEmpty({ message: '팀 1 이름은 필수 입력 항목입니다.' })
  team1Name: string;

  @ApiProperty({ description: '팀 2 이름', example: '팀 2' })
  @IsString()
  @IsNotEmpty({ message: '팀 2 이름은 필수 입력 항목입니다.' })
  team2Name: string;

  @ApiProperty({ description: '팀 1 점수', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '팀 1 점수는 필수 입력 항목입니다.' })
  team1Score: number;

  @ApiProperty({ description: '팀 2 점수', example: 2 })
  @IsNumber()
  @IsNotEmpty({ message: '팀 2 점수는 필수 입력 항목입니다.' })
  team2Score: number;
}
