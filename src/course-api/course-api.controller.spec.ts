import { Test, TestingModule } from '@nestjs/testing';
import { CourseApiController } from './course-api.controller';

describe('CourseApi Controller', () => {
  let controller: CourseApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseApiController],
    }).compile();

    controller = module.get<CourseApiController>(CourseApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
