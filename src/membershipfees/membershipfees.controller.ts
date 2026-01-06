import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembershipfeesService } from './membershipfees.service';
import { CreateMembershipFeeDto } from './dto/create-membershipfee.dto';
import { UpdateMembershipFeeDto } from './dto/update-membershipfee.dto';
import { MembershipFees } from './entities/membershipfee.entity';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('membershipfees')
export class MembershipfeesController {
  constructor(
    @InjectRepository(MembershipFees)
    private readonly membershipfeesService: MembershipfeesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '회비 등록',
    description: '새로운 회비를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '회비가 성공적으로 등록되었습니다.',
  })
  async create(
    @Body() createMembershipFeeDto: CreateMembershipFeeDto,
  ): Promise<string> {
    return await this.membershipfeesService.create(createMembershipFeeDto);
  }

  @Get()
  @ApiOperation({
    summary: '전체 회비 조회',
    description: '모든 회비 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '회비 목록 조회 성공' })
  async findAll(): Promise<MembershipFees[]> {
    return await this.membershipfeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '회비 상세 조회',
    description: 'ID로 특정 회비를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '회비 ID', example: 1 })
  @ApiResponse({ status: 200, description: '회비 조회 성공' })
  async findOne(@Param('id') id: string): Promise<MembershipFees> {
    return await this.membershipfeesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '회비 수정', description: '회비를 수정합니다.' })
  @ApiParam({ name: 'id', description: '회비 ID', example: 1 })
  @ApiResponse({ status: 200, description: '회비 수정 성공' })
  async update(
    @Param('id') id: string,
    @Body() updateMembershipFeeDto: UpdateMembershipFeeDto,
  ): Promise<string> {
    return await this.membershipfeesService.update(+id, updateMembershipFeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '회비 삭제', description: '회비를 삭제합니다.' })
  @ApiParam({ name: 'id', description: '회비 ID', example: 1 })
  @ApiResponse({ status: 200, description: '회비 삭제 성공' })
  async remove(@Param('id') id: string): Promise<string> {
    return await this.membershipfeesService.remove(+id);
  }
}
