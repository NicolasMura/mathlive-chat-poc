import { IMessage, IWebSocketMessage, MessageTypes } from '@mlchat-poc/models';

export class WebSocketMessage implements IWebSocketMessage {
  constructor(
    public event: string,
    public data: Message
  ) { }
}

export class Message implements IMessage {
  constructor(
    public messageType: MessageTypes,
    public isBroadcast: boolean,
    public sender: string,
    public content: string,
    public createdAt: string,
    public isMathliveContent: boolean
  ) { }
}
