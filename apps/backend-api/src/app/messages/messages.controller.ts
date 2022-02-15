import { Controller, Get } from '@nestjs/common';
import { WebSocketMessage } from '@mlchat-poc/models';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService
  ) {}

  @Get('')
  async getAll(): Promise<WebSocketMessage[]> {
    return this.messagesService.getAll();
  }
}
