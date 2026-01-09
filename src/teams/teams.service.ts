import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Teams } from './entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Players } from '../players/entities/player.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
    @InjectRepository(Players)
    private readonly playersRepository: Repository<Players>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<{
    message: string;
    id: number;
    teamId: number;
    teamName: string;
    dateId: string | null;
  }> {
    try {
      if (!createTeamDto.teamName || createTeamDto.teamName.trim() === '') {
        throw new BadRequestException(
          '[프론트엔드 문제] teamName 필드가 누락되었거나 비어있습니다. 팀 이름을 입력해주세요.',
        );
      }

      // 중복 팀 이름 체크
      const existing = await this.teamsRepository.findOne({
        where: { teamName: createTeamDto.teamName },
      });
      if (existing) {
        throw new BadRequestException(
          `[프론트엔드 문제] "${createTeamDto.teamName}" 이름의 팀이 이미 존재합니다. 다른 이름을 사용해주세요.`,
        );
      }

      const team = this.teamsRepository.create({
        teamName: createTeamDto.teamName,
        dateId: createTeamDto.dateId || null,
      });
      await this.teamsRepository.save(team);

      return {
        message: `${team.teamName} 팀이 생성되었습니다.`,
        id: team.id,
        teamId: team.id,
        teamName: team.teamName,
        dateId: team.dateId,
      };
    } catch (error) {
      console.error('[TeamsService.create] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23505') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이미 등록된 팀 이름입니다.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀 생성 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Teams[]> {
    try {
      return await this.teamsRepository.find({
        order: { teamName: 'ASC' },
      });
    } catch (error) {
      console.error('[TeamsService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 팀 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<Teams> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 팀 ID가 필요합니다. 숫자 형태의 ID를 전달해주세요.',
        );
      }

      const team = await this.teamsRepository.findOne({
        where: { id },
      });
      if (!team) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 팀을 찾을 수 없습니다. 존재하는 팀 ID인지 확인해주세요.`,
        );
      }
      return team;
    } catch (error) {
      console.error('[TeamsService.findOne] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateTeamDto: UpdateTeamDto,
  ): Promise<{ message: string; team: Teams }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 팀 ID가 필요합니다.',
        );
      }

      const team = await this.teamsRepository.findOne({ where: { id } });
      if (!team) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 팀을 찾을 수 없습니다.`,
        );
      }

      // 팀 이름 변경 시 중복 체크
      if (updateTeamDto.teamName && updateTeamDto.teamName !== team.teamName) {
        const existing = await this.teamsRepository.findOne({
          where: { teamName: updateTeamDto.teamName },
        });
        if (existing) {
          throw new BadRequestException(
            `[프론트엔드 문제] "${updateTeamDto.teamName}" 이름의 팀이 이미 존재합니다.`,
          );
        }
        team.teamName = updateTeamDto.teamName;
        await this.teamsRepository.save(team);
      }

      return { message: `${team.teamName} 팀이 수정되었습니다.`, team };
    } catch (error) {
      console.error('[TeamsService.update] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23505') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이미 존재하는 팀 이름입니다.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 팀 ID가 필요합니다.',
        );
      }

      const team = await this.teamsRepository.findOne({ where: { id } });
      if (!team) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 팀을 찾을 수 없습니다.`,
        );
      }

      const teamName = team.teamName;
      await this.teamsRepository.remove(team);

      return { message: `${teamName} 팀이 삭제되었습니다.`, id };
    } catch (error) {
      console.error('[TeamsService.remove] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이 팀과 연결된 기록(선수, 경기기록 등)이 있어 삭제할 수 없습니다. 연결된 기록을 먼저 삭제해주세요.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
