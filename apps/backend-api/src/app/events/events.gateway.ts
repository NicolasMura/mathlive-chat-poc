
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
// import { Server } from 'ws';
import * as WebSocket from 'ws';
// import { Server, Socket } from 'socket.io';
import { MessageTypes, WebSocketMessage } from '@mlchat-poc/models';
import { Get, Request } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import * as queryString from 'query-string';



// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// @WebSocketGateway(8082)
@WebSocketGateway(8082, { transports: ['websocket'] })
// @WebSocketGateway(8082, {
//   namespace: 'events',
//   transports: ['websocket']
// })
// @WebSocketGateway(8082, { transports: ['websocket'] })
// @WebSocketGateway({ port: 8082, transports: ['websocket'] })
// @WebSocketGateway({ path: '/api' })
// @WebSocketGateway({ port: 8082, path: '/api', origin: 'localhost:3334/api' })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
// export class EventsGateway {
  @WebSocketServer()
  server: WebSocket.Server;
  // server;
  // wsClients = [];
  wsClients = new Map<WebSocket, string>();
  public connectedSockets: { [key: string]: any[] } = {};

  usersCount = 0;

  constructor(
    private messagesService: MessagesService
  ) {}

  afterInit(server: WebSocket.Server) {
    // this.server = server;
    console.log('Init');
    // console.log(server);
    this.server.emit('testing', { do: 'stuff' });
  }

  async handleConnection(client: WebSocket, @Request() req: any) {
    console.log('A client has connected');
    // console.log(client);
    // console.log(req);
    // console.log(req.url);
    // console.log(req.url.replace('/', ''));
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

    // this.wsClients.push(client);
    this.wsClients.set(client, username);
    // A client has connected
    // this.usersCount++;
    // console.log(this.usersCount);
    console.log(this.wsClients.size);

    // Notify connected clients of current users
    // this.server.emit('Nb users', this.usersCount);
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
    // return { event: 'events', data: 'Nb users :' + this.usersCount };
  }

  async handleDisconnect(client: WebSocket) {
    console.log('A client has disconnected');
    // A client has disconnected
    // this.usersCount--;
    // console.log(this.usersCount);

    // Notify connected clients of current users
    // this.server.emit('Nb users', this.usersCount);
    for (const [c, id] of this.wsClients) {
      // console.log(c);
      if (c != client) {
        c.send(JSON.stringify({ event: 'events', data: `A client has disconnected (${this.wsClients.get(client)})` }));
      }
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
