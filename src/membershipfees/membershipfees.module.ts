import { Module } from '@nestjs/common';
import { MembershipfeesService } from './membershipfees.service';
import { MembershipfeesController } from './membershipfees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipFees } from './entities/membershipfee.entity';

@Module({
  controllers: [MembershipfeesController],
  providers: [MembershipfeesService],
  imports: [TypeOrmModule.forFeature([MembershipFees])],
})
export class MembershipfeesModule {}
