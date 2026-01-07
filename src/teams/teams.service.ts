import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Teams } from './entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Players } from '../players/entities/player.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
    @InjectRepository(Players)
    private readonly playersRepository: Repository<Players>,
  ) {}

  async create(
    createTeamDto: CreateTeamDto,
  ): Promise<{ message: string; teamId: number }> {
    // 팀 생성
    const team = this.teamsRepository.create({
      teamName: createTeamDto.teamName,
    });
    await this.teamsRepository.save(team);

    // 선수들을 팀에 배정
    // if (createTeamDto.playerIds && createTeamDto.playerIds.length > 0) {
    //   await this.playersRepository.update(
    //     { id: In(createTeamDto.playerIds) },
    //     { team: team },
    //   );
    // }

    return {
      message: `${team.teamName} 팀이 생성되었습니다.`,
      teamId: team.id,
    };
  }

  async findAll(): Promise<Teams[]> {
    return this.teamsRepository.find();
  }

  async findOne(id: number): Promise<Teams> {
    const team = await this.teamsRepository.findOne({
      where: { id },
    });
    if (!team) {
      throw new NotFoundException('해당 팀을 찾을 수 없습니다.');
    }
    return team;
  }

  async update(
    id: number,
    updateTeamDto: UpdateTeamDto,
  ): Promise<{ message: string; team: Teams }> {
    const team = await this.teamsRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('해당 팀을 찾을 수 없습니다.');
    }

    // 팀 이름 업데이트
    if (updateTeamDto.teamName) {
      team.teamName = updateTeamDto.teamName;
      await this.teamsRepository.save(team);
    }

    // 선수 목록 업데이트
    // if (updateTeamDto.playerIds) {
    //   // 기존 선수들의 팀 연결 해제
    //   await this.playersRepository
    //     .createQueryBuilder()
    //     .update()
    //     .set({ team: () => 'NULL' })
    //     .where('team_id = :teamId', { teamId: id })
    //     .execute();
    //   // 새 선수들 팀에 배정
    //   if (updateTeamDto.playerIds.length > 0) {
    //     await this.playersRepository.update(
    //       { id: In(updateTeamDto.playerIds) },
    //       { team: team },
    //     );
    //   }
    // }

    return { message: `${team.teamName} 팀이 수정되었습니다.`, team };
  }

  async remove(id: number): Promise<{ message: string }> {
    const team = await this.teamsRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('해당 팀을 찾을 수 없습니다.');
    }
    const teamName = team.teamName;
    await this.teamsRepository.remove(team);
    return { message: `${teamName} 팀이 삭제되었습니다.` };
  }
}
