import { PartialType } from '@nestjs/swagger';
import { CreateMembershipFeeDto } from './create-membershipfee.dto';

export class UpdateMembershipFeeDto extends PartialType(
  CreateMembershipFeeDto,
) {}
