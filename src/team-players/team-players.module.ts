import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamPlayersService } from './team-players.service';
import { TeamPlayersController } from './team-players.controller';
import { TeamPlayers } from './entities/team-player.entity';
import { Teams } from '../teams/entities/team.entity';
import { Players } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamPlayers, Teams, Players])],
  controllers: [TeamPlayersController],
  providers: [TeamPlayersService],
  exports: [TeamPlayersService],
})
export class TeamPlayersModule {}

