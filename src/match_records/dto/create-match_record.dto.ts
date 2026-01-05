import { IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateMatchRecordDto {
  @IsNumber()
  @IsNotEmpty({ message: '경기 ID는 필수 입력 항목입니다.' })
  matchId: number;
  @IsNumber()
  @IsNotEmpty({ message: '플레이어 ID는 필수 입력 항목입니다.' })
  playerId: number;
  @IsBoolean()
  @IsOptional({ message: '출석 여부는 선택 입력 항목입니다.' })
  attendance: boolean = false;
  @IsNumber()
  @IsOptional({ message: '골 수는 선택 입력 항목입니다.' })
  goals: number = 0;
  @IsNumber()
  @IsOptional({ message: '어시스트 수는 선택 입력 항목입니다.' })
  assists: number = 0;
  @IsNumber()
  @IsOptional({ message: '선정 여부는 선택 입력 항목입니다.' })
  cleanSheet: number = 0;
  @IsBoolean()
  @IsOptional({ message: 'MOM 여부는 선택 입력 항목입니다.' })
  mom: boolean = false;
}
