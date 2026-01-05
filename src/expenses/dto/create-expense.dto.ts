import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
export class CreateExpenseDto {
  @IsDateString()
  @IsNotEmpty({ message: '날짜는 필수 입력 항목입니다.' })
  expenseDate: string;
  @IsNumber()
  @IsNotEmpty({ message: '금액은 필수 입력 항목입니다.' })
  amount: number;
  @IsString()
  @IsNotEmpty({ message: '카테고리는 필수 입력 항목입니다.' })
  category: string;
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '설명은 필수 입력 항목입니다.' })
  description?: string = '';
}
