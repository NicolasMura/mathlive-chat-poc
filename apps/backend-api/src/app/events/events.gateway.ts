import { Request } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as WebSocket from 'ws';
// import { Server, Socket } from 'socket.io';
import * as queryString from 'query-string';
import { MessageTypes, User, WebSocketMessage } from '@mlchat-poc/models';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';


// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: WebSocket.Server;
  wsClients = new Map<WebSocket, string>();
  connectedSockets: { [key: string]: any[] } = {};
  usersCount = 0;

  constructor(
    private userService: UsersService,
    private messagesService: MessagesService
  ) {}

  afterInit(server: WebSocket.Server) {
    console.log('Init');
    // console.log(server);
    this.server.emit('testing', { do: 'stuff' });
  }

  async handleConnection(client: WebSocket, @Request() req: any) {
    console.log('A client has connected');
    const parsedUrl = queryString.parse(req.url.replace('/', ''), { arrayFormatSeparator: '&' });
    const username = (parsedUrl?.username as string) || 'Unavailable';
    console.log(username);

    // test
    // try {
    //   const token = req.headers['cookie']
    //     .split(';')
    //     .map(p => p.trim())
    //     .find(p => p.split('=')[0] === 'token')
    //     .split('=')[1];

    //   // // for this example, we simply set userId by token
    //   // client.userId = token;
    //   // client.userId = this.usersCount;

    //   // if (!this.connectedSockets[client.userId])
    //   //   this.connectedSockets[client.userId] = [];

    //   // this.connectedSockets[client.userId].push(client);
    // } catch (error) {
    //   console.log('set JWT cookie to authenticate');
    //   client.close(4403, 'set JWT cookie to authenticate');
    // }

    this.wsClients.set(client, username);
    console.log(this.wsClients.size);

    if (!this.userService.findUserByUsername(username)) {
      console.log('Add new user : ', username);
      this.userService.createUser(new User(username, false, ''));
    }

    // Notify connected clients of current users
    const newConnectionMessage = new WebSocketMessage(
      'events',
      {
        messageType: MessageTypes.CLIENT_CONNECT,
        isBroadcast: false,
        sender: username,
        createdAt: '@TODO',
        content: `A client has connected (${username})`
      }
    )
    for (const [c, id] of this.wsClients) {
      if (c != client) {
        c.send(JSON.stringify(newConnectionMessage));
      }
    }

    console.log('Users in cache : ', this.userService.findAll());
    // return { event: 'events', data: 'Nb users :' + this.wsClients.size };
  }

  async handleDisconnect(client: WebSocket) {
    console.log('A client has disconnected');
    // A client has disconnected

    const username = this.wsClients.get(client);

    // Notify connected clients of current users
    // this.server.emit('Nb users', this.usersCount);
    for (const [c, id] of this.wsClients) {
      // console.log(c);
      if (c != client) {
        c.send(JSON.stringify({ event: 'events', data: `A client has disconnected (${username})` }));
      }
    }

    if (this.userService.findUserByUsername(username)) {
      console.log('Delete existing user : ', username);
      this.userService.deleteUser(username);
    }

    this.wsClients.delete(client);
    console.log(this.wsClients.size);

    // test
    // this.connectedSockets[client.userId] = this.connectedSockets[
    //   client.userId
    // ].filter(p => p.id !== client.id);
  }

  @SubscribeMessage('chatMessage')
  // onEvent(@ConnectedSocket() client: WebSocket, @MessageBody() data: any): Observable<WsResponse<number>> {
  onEvent(@ConnectedSocket() client: WebSocket, @MessageBody() msg: WebSocketMessage): void {
    console.log(msg);
    // this.server.emit('events', data);
    // client.send(JSON.stringify({ event: 'events', data: 'testbob' }));

    // store message in cache
    this.messagesService.pushNewMessage(msg);

    // broadcast the message to other clients
    for (const [c, id] of this.wsClients) {
      // console.log(c);
      if (c != client) {
        c.send(JSON.stringify({ event: 'events', data: msg }));
      }
    }
    // return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
  // handleEvent(@MessageBody() data: string, @ConnectedSocket() client: WebSocket.WebSocket): string {
  //   return data;
  // }

  @SubscribeMessage('connect')
  onConnect(@ConnectedSocket() client: WebSocket, @MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('onConnect');
    console.log(data);
    // this.server.emit('events', data);
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
  // handleEvent(@MessageBody() data: string, @ConnectedSocket() client: WebSocket.WebSocket): string {
  //   return data;
  // }
}





// TESTS
// import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';

// @WebSocketGateway()
// export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
//   public connectedSockets: { [key: string]: any[] } = {};

//   async handleConnection(client: any, req: Request) {
//     try {
//       const token = req.headers['cookie']
//         .split(';')
//         .map(p => p.trim())
//         .find(p => p.split('=')[0] === 'token')
//         .split('=')[1];

//       // for this example, we simply set userId by token
//       client.userId = token;

//       if (!this.connectedSockets[client.userId])
//         this.connectedSockets[client.userId] = [];

//       this.connectedSockets[client.userId].push(client);
//     } catch (error) {
//       client.close(4403, 'set JWT cookie to authenticate');
//     }
//   }

//   handleDisconnect(client: any) {
//     this.connectedSockets[client.userId] = this.connectedSockets[
//       client.userId
//     ].filter(p => p.id !== client.id);
//   }
// }
