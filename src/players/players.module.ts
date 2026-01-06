import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Players } from './entities/player.entity';
import { MembershipFees } from 'src/membershipfees/entities/membershipfee.entity';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports: [TypeOrmModule.forFeature([Players, MembershipFees])],
})
export class PlayersModule {}
