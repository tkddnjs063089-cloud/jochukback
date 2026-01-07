import { IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMatchRecordDto {
  @ApiProperty({ description: '선수 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '플레이어 ID는 필수 입력 항목입니다.' })
  playerId: number;

  @ApiProperty({ description: '팀 ID', example: 1, required: true })
  @IsNumber()
  @IsNotEmpty({ message: '팀 ID는 필수 입력 항목입니다.' })
  teamId: number;

  @ApiPropertyOptional({
    description: '출석 여부',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional({ message: '출석 여부는 선택 입력 항목입니다.' })
  attendance: boolean = false;

  @ApiPropertyOptional({ description: '골 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional({ message: '골 수는 선택 입력 항목입니다.' })
  goals: number = 0;

  @ApiPropertyOptional({ description: '어시스트 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional({ message: '어시스트 수는 선택 입력 항목입니다.' })
  assists: number = 0;

  @ApiPropertyOptional({ description: '클린시트 수', example: 0, default: 0 })
  @IsNumber()
  @IsOptional({ message: '선정 여부는 선택 입력 항목입니다.' })
  cleanSheet: number = 0;

  @ApiPropertyOptional({
    description: 'MOM 여부',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional({ message: 'MOM 여부는 선택 입력 항목입니다.' })
  mom: boolean = false;

  @ApiPropertyOptional({
    description: '승리 수',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @IsOptional({ message: '승리 수는 선택 입력 항목입니다.' })
  wins: number = 0;

  @ApiPropertyOptional({
    description: '무승부 수',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @IsOptional({ message: '무승부 수는 선택 입력 항목입니다.' })
  draws: number = 0;

  @ApiPropertyOptional({
    description: '패배 수',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @IsOptional({ message: '패배 수는 선택 입력 항목입니다.' })
  losses: number = 0;
}
