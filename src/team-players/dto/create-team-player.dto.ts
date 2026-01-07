import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTeamPlayerDto {
  @ApiProperty({ description: '팀 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '팀 ID는 필수 입력 항목입니다.' })
  teamId: number;

  @ApiProperty({ description: '선수 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '선수 ID는 필수 입력 항목입니다.' })
  playerId: number;

  @ApiPropertyOptional({
    description: '팀 합류 일시 (Unix timestamp 밀리초)',
    example: 1735862400000,
  })
  @IsNumber()
  @IsOptional()
  joinedAt?: number;
}

