import { Test, TestingModule } from '@nestjs/testing';
import { MembershipfeesController } from './membershipfees.controller';
import { MembershipfeesService } from './membershipfees.service';

describe('MembershipfeesController', () => {
  let controller: MembershipfeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipfeesController],
      providers: [MembershipfeesService],
    }).compile();

    controller = module.get<MembershipfeesController>(MembershipfeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
