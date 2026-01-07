import {
  ConflictException,
  Injectable,
  NotFoundException,
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
    // 팀 존재 확인
    const team = await this.teamsRepository.findOne({
      where: { id: createTeamPlayerDto.teamId },
    });
    if (!team) {
      throw new NotFoundException(
        `ID가 ${createTeamPlayerDto.teamId}인 팀을 찾을 수 없습니다.`,
      );
    }

    // 선수 존재 확인
    const player = await this.playersRepository.findOne({
      where: { id: createTeamPlayerDto.playerId },
    });
    if (!player) {
      throw new NotFoundException(
        `ID가 ${createTeamPlayerDto.playerId}인 선수를 찾을 수 없습니다.`,
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
      throw new ConflictException('해당 선수는 이미 이 팀에 속해 있습니다.');
    }

    // joinedAt 변환: 숫자(ms timestamp)면 ISO string으로 변환
    let joinedAtValue: string;
    if (createTeamPlayerDto.joinedAt == null) {
      joinedAtValue = new Date().toISOString();
    } else if (typeof createTeamPlayerDto.joinedAt === 'number') {
      // ms timestamp → ISO string
      joinedAtValue = new Date(createTeamPlayerDto.joinedAt).toISOString();
    } else {
      // 이미 string이면 그대로 사용
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
  }

  async findAll(): Promise<TeamPlayers[]> {
    return this.teamPlayersRepository.find({
      relations: ['team', 'player'],
    });
  }

  async findOne(id: number): Promise<TeamPlayers> {
    const teamPlayer = await this.teamPlayersRepository.findOne({
      where: { id },
      relations: ['team', 'player'],
    });
    if (!teamPlayer) {
      throw new NotFoundException('해당 팀-선수 관계를 찾을 수 없습니다.');
    }
    return teamPlayer;
  }

  async findByTeam(teamId: number): Promise<TeamPlayers[]> {
    return this.teamPlayersRepository.find({
      where: { teamId },
      relations: ['player'],
    });
  }

  async findByPlayer(playerId: number): Promise<TeamPlayers[]> {
    return this.teamPlayersRepository.find({
      where: { playerId },
      relations: ['team'],
    });
  }

  async update(
    id: number,
    updateTeamPlayerDto: UpdateTeamPlayerDto,
  ): Promise<{ message: string; teamPlayer: TeamPlayers }> {
    const teamPlayer = await this.teamPlayersRepository.findOne({
      where: { id },
    });
    if (!teamPlayer) {
      throw new NotFoundException('해당 팀-선수 관계를 찾을 수 없습니다.');
    }

    if (updateTeamPlayerDto.joinedAt != null) {
      // joinedAt 변환: 숫자(ms timestamp)면 ISO string으로 변환
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
  }

  async remove(id: number): Promise<{ message: string }> {
    const teamPlayer = await this.teamPlayersRepository.findOne({
      where: { id },
      relations: ['team', 'player'],
    });
    if (!teamPlayer) {
      throw new NotFoundException('해당 팀-선수 관계를 찾을 수 없습니다.');
    }

    await this.teamPlayersRepository.remove(teamPlayer);

    return { message: '팀-선수 관계가 삭제되었습니다.' };
  }
}
