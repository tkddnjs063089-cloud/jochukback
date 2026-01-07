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
    description: '팀 합류 일시 (ISO 문자열 또는 ms timestamp)',
    example: 1767366000000,
  })
  @IsOptional()
  joinedAt?: string | number; // 프론트에서 숫자(ms)로 보내므로 둘 다 허용
}
