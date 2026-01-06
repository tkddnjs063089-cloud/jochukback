import { IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMatchRecordDto {
  @ApiProperty({ description: '경기 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '경기 ID는 필수 입력 항목입니다.' })
  matchId: number;

  @ApiProperty({ description: '선수 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '플레이어 ID는 필수 입력 항목입니다.' })
  playerId: number;

  @ApiPropertyOptional({
    description: '출석 여부',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional({ message: '출석 여부는 선택 입력 항목입니다.' })
  status: boolean = false;

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
}
