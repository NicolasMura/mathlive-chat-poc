import { Controller, Get } from '@nestjs/common';
import { WebSocketMessage } from '@mlchat-poc/models';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService
  ) {}

  @Get('')
  getAll(): WebSocketMessage[] {
    return this.messagesService.getAll();
  }
}
