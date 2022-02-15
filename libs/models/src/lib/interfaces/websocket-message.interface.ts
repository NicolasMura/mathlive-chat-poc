export enum MessageTypes {
  CLIENT_CONNECT = 'clientConnect',
  CLIENT_DISCONNECT = 'clientDisconnect',
  USER_MESSAGE = 'userMessage'
}

export interface IWebSocketMessage {
  event: string;
  data: IMessage;
}

export interface IMessage {
  messageType: MessageTypes;
  isBroadcast: boolean;
  sender: string;
  createdAt: string;
  content: string;
  isMathliveContent?: boolean;
}
