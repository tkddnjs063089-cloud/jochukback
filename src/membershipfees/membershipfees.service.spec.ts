import { Test, TestingModule } from '@nestjs/testing';
import { MembershipfeesService } from './membershipfees.service';

describe('MembershipfeesService', () => {
  let service: MembershipfeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipfeesService],
    }).compile();

    service = module.get<MembershipfeesService>(MembershipfeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
