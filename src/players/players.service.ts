import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
  async create(createPlayerDto: CreatePlayerDto): Promise<{ message: string }> {
    const player = this.playersRepository.create({
      name: createPlayerDto.name,
    });
    await this.playersRepository.save(player);
    return { message: `${player.name} 선수가 생성되었습니다.` };
  }
  async findAll(): Promise<Players[]> {
    return this.playersRepository.find();
  }
  async findOne(id: number): Promise<Players> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('해당 선수를 찾을 수 없습니다.');
    }
    return player;
  }
  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<{ message: string; player: Players }> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('해당 선수를 찾을 수 없습니다.');
    }
    await this.playersRepository.save(Object.assign(player, updatePlayerDto));
    return {
      message: `${player.name} 선수가 수정되었습니다.`,
      player,
    };
  }
  async remove(id: number): Promise<{ message: string; id: number }> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('해당 선수를 찾을 수 없습니다.');
    }
    const playerName = player.name;
    await this.playersRepository.remove(player);
    return {
      message: `${playerName} 선수가 삭제되었습니다.`,
      id,
    };
  }
}
