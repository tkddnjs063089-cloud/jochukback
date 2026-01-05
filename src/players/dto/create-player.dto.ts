import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  @MaxLength(50, { message: '이름은 최대 50자 이하여야 합니다.' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: '역할은 필수 입력 항목입니다.' })
  @MaxLength(20, { message: '역할은 최대 20자 이하여야 합니다.' })
  role: string;
  @IsString()
  @IsOptional({ message: '상태는 선택 입력 항목입니다.' })
  @MaxLength(20, { message: '상태는 최대 20자 이하여야 합니다.' })
  status?: string = 'ACTIVE';
}
