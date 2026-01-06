import { Module } from '@nestjs/common';
import { TeamPlayersService } from './team-players.service';
import { TeamPlayersController } from './team-players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamPlayers } from './entities/team-player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamPlayers])],
  controllers: [TeamPlayersController],
  providers: [TeamPlayersService],
})
export class TeamPlayersModule {}
