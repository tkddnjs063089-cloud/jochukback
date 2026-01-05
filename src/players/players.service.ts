import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Repository } from 'typeorm';
import { Players } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(private readonly playersRepository: Repository<Players>) {}
  async create(createPlayerDto: CreatePlayerDto): Promise<Players> {
    const player = this.playersRepository.create(createPlayerDto);
    return this.playersRepository.save(player);
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
  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Players> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('해당 선수를 찾을 수 없습니다.');
    }
    return this.playersRepository.save(Object.assign(player, updatePlayerDto));
  }
  async remove(id: number): Promise<void> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('해당 선수를 찾을 수 없습니다.');
    }
    await this.playersRepository.remove(player);
  }
}
