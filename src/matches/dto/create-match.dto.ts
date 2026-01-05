import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsIn,
} from 'class-validator';

export class CreateMatchDto {
  @IsDateString()
  @IsNotEmpty({ message: '날짜는 필수 입력 항목입니다.' })
  matchDate: string;
  @IsNumber()
  @IsNotEmpty({ message: '순서는 필수 입력 항목입니다.' })
  @Min(1, { message: '순서는 1 이상이어야 합니다.' })
  matchOrder: number;
  @IsString()
  @IsIn(['PINK', 'BLACK'], { message: '팀 타입은 PINK 또는 BLACK여야 합니다.' })
  teamType: 'PINK' | 'BLACK' = 'PINK';
}
