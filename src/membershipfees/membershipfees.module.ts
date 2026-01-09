import { Module } from '@nestjs/common';
import { MembershipfeesService } from './membershipfees.service';
import { MembershipfeesController } from './membershipfees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipFees } from './entities/membershipfee.entity';
import { Players } from 'src/players/entities/player.entity';

@Module({
  controllers: [MembershipfeesController],
  providers: [MembershipfeesService],
  imports: [TypeOrmModule.forFeature([MembershipFees, Players])],
})
export class MembershipfeesModule {}
