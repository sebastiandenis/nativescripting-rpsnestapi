import { Injectable } from '@nestjs/common';
import { IMessageObject } from './models/domain/message-object.model';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getMessage(): IMessageObject {
    const messageObject: IMessageObject = {
      message: 'Hi there, welcome to NativeScription!',
    };

    return messageObject;
  }
}
