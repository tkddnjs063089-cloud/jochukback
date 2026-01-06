import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ description: '선수 이름', example: '홍길동', maxLength: 50 })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  @MaxLength(50, { message: '이름은 최대 50자 이하여야 합니다.' })
  name: string;
  @ApiProperty({ description: '팀 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '팀 ID는 필수 입력 항목입니다.' })
  teamId: number;
}
