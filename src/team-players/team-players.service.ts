import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTeamPlayerDto } from './dto/create-team-player.dto';
import { UpdateTeamPlayerDto } from './dto/update-team-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamPlayers } from './entities/team-player.entity';
import { Teams } from '../teams/entities/team.entity';
import { Players } from '../players/entities/player.entity';

@Injectable()
export class TeamPlayersService {
  constructor(
    @InjectRepository(TeamPlayers)
    private readonly teamPlayersRepository: Repository<TeamPlayers>,
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
    @InjectRepository(Players)
    private readonly playersRepository: Repository<Players>,
  ) {}

  async create(createTeamPlayerDto: CreateTeamPlayerDto): Promise<{
    message: string;
    id: number;
    teamPlayer: TeamPlayers;
  }> {
    try {
      // 필수 필드 검증
      if (!createTeamPlayerDto.teamId) {
        throw new BadRequestException(
          '[프론트엔드 문제] teamId 필드가 누락되었습니다.',
        );
      }
      if (!createTeamPlayerDto.playerId) {
        throw new BadRequestException(
          '[프론트엔드 문제] playerId 필드가 누락되었습니다.',
        );
      }

      // 팀 존재 확인
      const team = await this.teamsRepository.findOne({
        where: { id: createTeamPlayerDto.teamId },
      });
      if (!team) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${createTeamPlayerDto.teamId}인 팀을 찾을 수 없습니다. teamId를 확인해주세요.`,
        );
      }

      // 선수 존재 확인
      const player = await this.playersRepository.findOne({
        where: { id: createTeamPlayerDto.playerId },
      });
      if (!player) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${createTeamPlayerDto.playerId}인 선수를 찾을 수 없습니다. playerId를 확인해주세요.`,
        );
      }

      // 중복 체크
      const existing = await this.teamPlayersRepository.findOne({
        where: {
          teamId: createTeamPlayerDto.teamId,
          playerId: createTeamPlayerDto.playerId,
        },
      });
      if (existing) {
        throw new ConflictException(
          `[프론트엔드 문제] ${player.name} 선수는 이미 ${team.teamName} 팀에 속해 있습니다.`,
        );
      }

      // joinedAt 변환: 숫자(ms timestamp)면 ISO string으로 변환
      let joinedAtValue: string;
      if (createTeamPlayerDto.joinedAt == null) {
        joinedAtValue = new Date().toISOString();
      } else if (typeof createTeamPlayerDto.joinedAt === 'number') {
        joinedAtValue = new Date(createTeamPlayerDto.joinedAt).toISOString();
      } else {
        joinedAtValue = createTeamPlayerDto.joinedAt;
      }

      const teamPlayer = this.teamPlayersRepository.create({
        teamId: createTeamPlayerDto.teamId,
        playerId: createTeamPlayerDto.playerId,
        joinedAt: joinedAtValue,
      });

      await this.teamPlayersRepository.save(teamPlayer);

      return {
        message: `${player.name} 선수가 ${team.teamName} 팀에 추가되었습니다.`,
        id: teamPlayer.id,
        teamPlayer,
      };
    } catch (error) {
      console.error('[TeamPlayersService.create] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      if (error.code === '23505') {
        throw new ConflictException(
          '[프론트엔드 문제] 이 선수는 이미 해당 팀에 등록되어 있습니다.',
        );
      }
      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 존재하지 않는 팀 또는 선수 ID입니다.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀-선수 등록 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<TeamPlayers[]> {
    try {
      return await this.teamPlayersRepository.find({
        relations: ['team', 'player'],
      });
    } catch (error) {
      console.error('[TeamPlayersService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 팀-선수 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<TeamPlayers> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 팀-선수 ID가 필요합니다.',
        );
      }

      const teamPlayer = await this.teamPlayersRepository.findOne({
        where: { id },
        relations: ['team', 'player'],
      });
      if (!teamPlayer) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 팀-선수 관계를 찾을 수 없습니다.`,
        );
      }
      return teamPlayer;
    } catch (error) {
      console.error('[TeamPlayersService.findOne] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀-선수 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findByTeam(teamId: number): Promise<TeamPlayers[]> {
    try {
      if (!teamId || isNaN(teamId)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 팀 ID가 필요합니다.',
        );
      }

      return await this.teamPlayersRepository.find({
        where: { teamId },
        relations: ['player'],
      });
    } catch (error) {
      console.error('[TeamPlayersService.findByTeam] 에러:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀별 선수 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findByPlayer(playerId: number): Promise<TeamPlayers[]> {
    try {
      if (!playerId || isNaN(playerId)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 선수 ID가 필요합니다.',
        );
      }

      return await this.teamPlayersRepository.find({
        where: { playerId },
        relations: ['team'],
      });
    } catch (error) {
      console.error('[TeamPlayersService.findByPlayer] 에러:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 선수별 팀 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateTeamPlayerDto: UpdateTeamPlayerDto,
  ): Promise<{ message: string; teamPlayer: TeamPlayers }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 팀-선수 ID가 필요합니다.',
        );
      }

      const teamPlayer = await this.teamPlayersRepository.findOne({
        where: { id },
      });
      if (!teamPlayer) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 팀-선수 관계를 찾을 수 없습니다.`,
        );
      }

      if (updateTeamPlayerDto.joinedAt != null) {
        if (typeof updateTeamPlayerDto.joinedAt === 'number') {
          teamPlayer.joinedAt = new Date(
            updateTeamPlayerDto.joinedAt,
          ).toISOString();
        } else {
          teamPlayer.joinedAt = updateTeamPlayerDto.joinedAt;
        }
      }

      await this.teamPlayersRepository.save(teamPlayer);

      return { message: '팀-선수 관계가 수정되었습니다.', teamPlayer };
    } catch (error) {
      console.error('[TeamPlayersService.update] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀-선수 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 팀-선수 ID가 필요합니다.',
        );
      }

      const teamPlayer = await this.teamPlayersRepository.findOne({
        where: { id },
        relations: ['team', 'player'],
      });
      if (!teamPlayer) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 팀-선수 관계를 찾을 수 없습니다.`,
        );
      }

      const playerName = teamPlayer.player?.name ?? '알 수 없는 선수';
      const teamName = teamPlayer.team?.teamName ?? '알 수 없는 팀';

      await this.teamPlayersRepository.remove(teamPlayer);

      return {
        message: `${playerName} 선수가 ${teamName} 팀에서 제외되었습니다.`,
        id,
      };
    } catch (error) {
      console.error('[TeamPlayersService.remove] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 팀-선수 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
