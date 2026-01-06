import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ description: '팀 이름', example: '팀 이름', maxLength: 50 })
  @IsString()
  @IsNotEmpty({ message: '팀 이름은 필수 입력 항목입니다.' })
  @MaxLength(50, { message: '팀 이름은 최대 50자 이하여야 합니다.' })
  teamName: string;
  @ApiProperty({ description: '팀 소속 선수', example: [1, 2, 3] })
  @IsNumber()
  @IsNotEmpty({ message: '팀 소속 선수는 필수 입력 항목입니다.' })
  playerId: number;
}
