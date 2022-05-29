// import { User } from '../models/user.model';
import { WebSocketMessage } from '@mlchat-poc/frontend-tools';
import { MessageTypes } from '../interfaces/websocket-message.interface';


const getDefaults = (): WebSocketMessage => ({
  event: 'message',
  data: {
    messageType: MessageTypes.USER_MESSAGE,
    isBroadcast: false,
    sender: "Nikouz",
    content: "Hello!",
    createdAt: "",
    isMathliveContent: false
  }
});

export const getWebSocketMessageMock = (webSocketmessage?: Partial<WebSocketMessage>): WebSocketMessage => ({
  ...getDefaults(),
  ...webSocketmessage
});
