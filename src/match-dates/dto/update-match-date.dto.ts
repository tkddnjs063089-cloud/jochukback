import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDateDto } from './create-match-date.dto';

export class UpdateMatchDateDto extends PartialType(CreateMatchDateDto) {}
