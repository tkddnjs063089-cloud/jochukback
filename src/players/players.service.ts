import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Repository } from 'typeorm';
import { Players } from './entities/player.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Players)
    private readonly playersRepository: Repository<Players>,
  ) {}

  async create(
    createPlayerDto: CreatePlayerDto,
  ): Promise<{ message: string; id: number; player: Players }> {
    try {
      if (!createPlayerDto.name || createPlayerDto.name.trim() === '') {
        throw new BadRequestException(
          '[프론트엔드 문제] name 필드가 누락되었거나 비어있습니다. 선수 이름을 입력해주세요.',
        );
      }

      // 중복 이름 체크
      const existing = await this.playersRepository.findOne({
        where: { name: createPlayerDto.name },
      });
      if (existing) {
        throw new BadRequestException(
          `[프론트엔드 문제] "${createPlayerDto.name}" 이름의 선수가 이미 존재합니다. 다른 이름을 사용해주세요.`,
        );
      }

      const player = this.playersRepository.create({
        name: createPlayerDto.name,
      });
      await this.playersRepository.save(player);

      return {
        message: `${player.name} 선수가 생성되었습니다.`,
        id: player.id,
        player,
      };
    } catch (error) {
      console.error('[PlayersService.create] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23505') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이미 등록된 선수 이름입니다.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 선수 생성 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Players[]> {
    try {
      return await this.playersRepository.find({
        order: { name: 'ASC' },
      });
    } catch (error) {
      console.error('[PlayersService.findAll] 에러:', error);
      throw new InternalServerErrorException(
        `[백엔드 문제] 선수 목록 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<Players> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 선수 ID가 필요합니다. 숫자 형태의 ID를 전달해주세요.',
        );
      }

      const player = await this.playersRepository.findOne({ where: { id } });
      if (!player) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 선수를 찾을 수 없습니다. 존재하는 선수 ID인지 확인해주세요.`,
        );
      }
      return player;
    } catch (error) {
      console.error('[PlayersService.findOne] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 선수 조회 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<{ message: string; player: Players }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 선수 ID가 필요합니다.',
        );
      }

      const player = await this.playersRepository.findOne({ where: { id } });
      if (!player) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 선수를 찾을 수 없습니다.`,
        );
      }

      // 이름 변경 시 중복 체크
      if (updatePlayerDto.name && updatePlayerDto.name !== player.name) {
        const existing = await this.playersRepository.findOne({
          where: { name: updatePlayerDto.name },
        });
        if (existing) {
          throw new BadRequestException(
            `[프론트엔드 문제] "${updatePlayerDto.name}" 이름의 선수가 이미 존재합니다.`,
          );
        }
      }

      await this.playersRepository.save(
        Object.assign(player, updatePlayerDto),
      );

      return {
        message: `${player.name} 선수가 수정되었습니다.`,
        player,
      };
    } catch (error) {
      console.error('[PlayersService.update] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23505') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이미 존재하는 선수 이름입니다.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 선수 수정 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException(
          '[프론트엔드 문제] 유효한 선수 ID가 필요합니다.',
        );
      }

      const player = await this.playersRepository.findOne({ where: { id } });
      if (!player) {
        throw new NotFoundException(
          `[프론트엔드 문제] ID가 ${id}인 선수를 찾을 수 없습니다.`,
        );
      }

      const playerName = player.name;
      await this.playersRepository.remove(player);

      return {
        message: `${playerName} 선수가 삭제되었습니다.`,
        id,
      };
    } catch (error) {
      console.error('[PlayersService.remove] 에러:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          '[프론트엔드 문제] 이 선수와 연결된 기록(팀, 경기기록, 지출, 회비 등)이 있어 삭제할 수 없습니다. 연결된 기록을 먼저 삭제해주세요.',
        );
      }

      throw new InternalServerErrorException(
        `[백엔드 문제] 선수 삭제 중 서버 오류가 발생했습니다. 상세: ${error.message}`,
      );
    }
  }
}
