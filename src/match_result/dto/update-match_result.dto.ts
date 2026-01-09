import { PartialType } from '@nestjs/swagger';
import { CreateMatchResultDto } from './create-match_result.dto';

export class UpdateMatchResultDto extends PartialType(CreateMatchResultDto) {}
