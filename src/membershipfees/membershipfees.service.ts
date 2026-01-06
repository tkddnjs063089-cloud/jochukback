import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMembershipFeeDto } from './dto/create-membershipfee.dto';
import { UpdateMembershipFeeDto } from './dto/update-membershipfee.dto';
import { MembershipFees } from './entities/membershipfee.entity';

@Injectable()
export class MembershipfeesService {
  constructor(
    @InjectRepository(MembershipFees)
    private readonly membershipFeesRepository: Repository<MembershipFees>,
  ) {}

  async create(
    createMembershipFeeDto: CreateMembershipFeeDto,
  ): Promise<string> {
    const membershipFee = this.membershipFeesRepository.create({
      revenueDate: createMembershipFeeDto.revenueDate,
      amount: createMembershipFeeDto.amount,
      monthCount: createMembershipFeeDto.monthCount,
      player: { id: createMembershipFeeDto.playerId },
    });
    await this.membershipFeesRepository.save(membershipFee);
    return '회비가 성공적으로 등록되었습니다.';
  }

  async findAll(): Promise<MembershipFees[]> {
    return await this.membershipFeesRepository.find({
      relations: ['player'],
    });
  }

  async findOne(id: number): Promise<MembershipFees> {
    const membershipFee = await this.membershipFeesRepository.findOne({
      where: { id },
      relations: ['player'],
    });
    if (!membershipFee) {
      throw new NotFoundException('해당 회비 정보를 찾을 수 없습니다.');
    }
    return membershipFee;
  }

  async update(
    id: number,
    updateMembershipFeeDto: UpdateMembershipFeeDto,
  ): Promise<string> {
    const membershipFee = await this.membershipFeesRepository.findOne({
      where: { id },
    });
    if (!membershipFee) {
      throw new NotFoundException('해당 회비 정보를 찾을 수 없습니다.');
    }
    await this.membershipFeesRepository.save(
      Object.assign(membershipFee, updateMembershipFeeDto),
    );
    return '회비 정보가 성공적으로 수정되었습니다.';
  }

  async remove(id: number): Promise<string> {
    const membershipFee = await this.membershipFeesRepository.findOne({
      where: { id },
    });
    if (!membershipFee) {
      throw new NotFoundException('해당 회비 정보를 찾을 수 없습니다.');
    }
    await this.membershipFeesRepository.remove(membershipFee);
    return '회비 정보가 성공적으로 삭제되었습니다.';
  }
}
