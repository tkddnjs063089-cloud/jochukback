import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Teams } from './entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
  ) {}
  async create(createTeamDto: CreateTeamDto): Promise<string> {
    const team = this.teamsRepository.create(createTeamDto);
    await this.teamsRepository.save(team);
    return `${team.teamName} 팀이 생성되었습니다.`;
  }
  async findAll(): Promise<Teams[]> {
    return this.teamsRepository.find();
  }
  async findOne(id: number): Promise<Teams> {
    const team = await this.teamsRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('해당 팀을 찾을 수 없습니다.');
    }
    return team;
  }
  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<string> {
    const team = await this.teamsRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('해당 팀을 찾을 수 없습니다.');
    }
    await this.teamsRepository.save(Object.assign(team, updateTeamDto));
    return `${team.teamName} 팀이 수정되었습니다.`;
  }
  async remove(id: number): Promise<string> {
    const team = await this.teamsRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('해당 팀을 찾을 수 없습니다.');
    }
    await this.teamsRepository.remove(team);
    return `${team.teamName} 팀이 삭제되었습니다.`;
  }
}
