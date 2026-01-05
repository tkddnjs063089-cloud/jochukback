import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateMatchRecordDto {
  @IsNumber()
  matchId: number;
  @IsNumber()
  playerId: number;
  @IsBoolean()
  attendance: boolean = false;
  @IsNumber()
  goals: number = 0;
  @IsNumber()
  assists: number = 0;
  @IsBoolean()
  cleanSheet: boolean = false;
  @IsBoolean()
  mom: boolean = false;
}
