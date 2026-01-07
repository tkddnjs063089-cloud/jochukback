import { PartialType } from '@nestjs/swagger';
import { CreateTeamPlayerDto } from './create-team-player.dto';

export class UpdateTeamPlayerDto extends PartialType(CreateTeamPlayerDto) {}

