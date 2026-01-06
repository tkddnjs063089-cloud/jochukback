import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from './entities/team.entity';
import { Players } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teams, Players])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
