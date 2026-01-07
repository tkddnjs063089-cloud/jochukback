import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ description: '팀 이름', example: '핑크팀', maxLength: 255 })
  @IsString()
  @IsNotEmpty({ message: '팀 이름은 필수 입력 항목입니다.' })
  @MaxLength(255, { message: '팀 이름은 최대 255자 이하여야 합니다.' })
  teamName: string;
}
