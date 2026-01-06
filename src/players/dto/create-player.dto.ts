import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ description: '선수 이름', example: '홍길동', maxLength: 50 })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  @MaxLength(50, { message: '이름은 최대 50자 이하여야 합니다.' })
  name: string;

  @ApiProperty({
    description: '선수 역할 (포지션)',
    example: 'FW',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: '역할은 필수 입력 항목입니다.' })
  @MaxLength(20, { message: '역할은 최대 20자 이하여야 합니다.' })
  position: string;

  @ApiPropertyOptional({
    description: '선수 상태',
    example: 'ACTIVE',
    default: 'ACTIVE',
    maxLength: 20,
  })
  @IsString()
  @IsOptional({ message: '상태는 선택 입력 항목입니다.' })
  @MaxLength(20, { message: '상태는 최대 20자 이하여야 합니다.' })
  status?: string = 'ACTIVE';
}
