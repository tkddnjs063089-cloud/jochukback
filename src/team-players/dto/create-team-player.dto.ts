import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTeamPlayerDto {
  @ApiProperty({ description: '팀 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '팀 ID는 필수 입력 항목입니다.' })
  teamId: number;

  @ApiProperty({ description: '선수 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '선수 ID는 필수 입력 항목입니다.' })
  playerId: number;

  @ApiProperty({ description: '팀 선수 등록 날짜', example: '2026-01-05' })
  @IsDateString()
  @IsNotEmpty({ message: '팀 선수 등록 날짜는 필수 입력 항목입니다.' })
  joinedAt: string;
}
