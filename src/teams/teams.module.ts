import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from './entities/team.entity';
import { TeamPlayersModule } from '../team-players/team-players.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teams]), TeamPlayersModule],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
