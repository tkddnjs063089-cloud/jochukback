import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teams])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
