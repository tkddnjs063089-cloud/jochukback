import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchRecordDto } from './create-match_record.dto';

export class UpdateMatchRecordDto extends PartialType(CreateMatchRecordDto) {}
