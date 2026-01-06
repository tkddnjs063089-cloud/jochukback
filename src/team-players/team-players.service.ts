import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamPlayerDto } from './dto/create-team-player.dto';
import { UpdateTeamPlayerDto } from './dto/update-team-player.dto';
import { TeamPlayers } from './entities/team-player.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamPlayersService {
  constructor(
    @InjectRepository(TeamPlayers)
    private readonly teamPlayersRepository: Repository<TeamPlayers>,
  ) {}
  async create(createTeamPlayerDto: CreateTeamPlayerDto): Promise<string> {
    const teamPlayer = this.teamPlayersRepository.create(createTeamPlayerDto);
    await this.teamPlayersRepository.save(teamPlayer);
    return `${teamPlayer.player.name} 선수가 ${teamPlayer.team.name} 팀에 등록되었습니다.`;
  }
  async findAll(): Promise<TeamPlayers[]> {
    return this.teamPlayersRepository.find();
  }
  async findOne(id: number): Promise<TeamPlayers> {
    const teamPlayer = await this.teamPlayersRepository.findOne({
      where: { id },
    });
    if (!teamPlayer) {
      throw new NotFoundException('해당 팀 선수를 찾을 수 없습니다.');
    }
    return teamPlayer;
  }
  async update(
    id: number,
    updateTeamPlayerDto: UpdateTeamPlayerDto,
  ): Promise<string> {
    const teamPlayer = await this.teamPlayersRepository.findOne({
      where: { id },
    });
    if (!teamPlayer) {
      throw new NotFoundException('해당 팀 선수를 찾을 수 없습니다.');
    }
    await this.teamPlayersRepository.save(
      Object.assign(teamPlayer, updateTeamPlayerDto),
    );
    return `${teamPlayer.player.name} 선수가 ${teamPlayer.team.name} 팀에 등록되었습니다.`;
  }
  async remove(id: number): Promise<string> {
    const teamPlayer = await this.teamPlayersRepository.findOne({
      where: { id },
    });
    if (!teamPlayer) {
      throw new NotFoundException('해당 팀 선수를 찾을 수 없습니다.');
    }
    await this.teamPlayersRepository.remove(teamPlayer);
    return `${teamPlayer.player.name} 선수가 ${teamPlayer.team.name} 팀에 등록되었습니다.`;
  }
}
