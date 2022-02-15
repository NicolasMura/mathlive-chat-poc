import { Injectable } from '@nestjs/common';
import { WebSocketMessage } from '@mlchat-poc/models';

@Injectable()
export class MessagesService {
  private messages: WebSocketMessage[] = [];

  async getAll(): Promise<WebSocketMessage[]> {
    console.log('messages in cache : ', this.messages);
    return this.messages;
  }

  pushNewMessage(msg: WebSocketMessage): void {
    this.messages.push(msg);
    if (this.messages.length > 10) {
      this.messages.splice(0, 1);
    }
    console.log('messages in cache : ', this.messages);
  }
}
