import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseApiController } from './course-api/course-api.controller';

@Module({
  imports: [],
  controllers: [AppController, CourseApiController],
  providers: [AppService],
})
export class AppModule {}
