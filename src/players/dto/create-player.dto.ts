import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ description: '선수 이름', example: '홍길동', maxLength: 50 })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  @MaxLength(50, { message: '이름은 최대 50자 이하여야 합니다.' })
  name: string;
}
