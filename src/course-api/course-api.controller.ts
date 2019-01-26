import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { IMessageObject } from 'src/models/domain/message-object.model';

@Controller('api')
export class CourseApiController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getMessage(): IMessageObject {
    return this.appService.getMessage();
  }

  @Get('/backlog')
  getBacklog(): string {
    return 'backlog';
  }
}
