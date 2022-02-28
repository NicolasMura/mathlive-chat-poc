import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import * as moment from 'moment';
import { environment, ErrorHandlingService } from '@mlchat-poc/frontend-tools';
import { catchError, delay, retryWhen, takeUntil, tap } from 'rxjs/operators';
import { Subject, Observable, EMPTY, BehaviorSubject, throwError } from 'rxjs';
import { WebSocketMessage, Message } from '../models/websocket-message.model';
import { MessageTypes } from '@mlchat-poc/models';
import { GlobalService } from './global-service.service'; // strangely weird, but need to be imported like this...
// import { WebSocketMessage } from 'projects/tools/src/lib/models/websocket-message.model';
export const WS_ENDPOINT = environment.wsEndpoint;
const RECONNECT_INTERVAL = 5000;

/**
 * WebSocket Service
 * https://javascript-conference.com/blog/real-time-in-angular-a-journey-into-websocket-and-rxjs
 */
@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends GlobalService implements OnDestroy {
  protected baseUrlMessage = environment.backendApi.baseUrlMessage;

  /**
   * RxJS WebSocket Subject
   */
  private socket$: WebSocketSubject<WebSocketMessage> = undefined as any;
  /**
   * Private websocket message, as a subject
   * Nobody outside the WebSocketService should have access to this Subject
   */
  private messageSubject: Subject<string> = new Subject();
  /**
   * Expose the observable$ part of the messageSubject subject (read only stream)
   */
  public readonly message$: Observable<string> = this.messageSubject.asObservable();
  /**
   * Subject completed when Websocket connection is destroyed
   */
  destroyed$ = new Subject();

  /**
   * True if WebSocket succesfully reconnect after lost, which means that we must fetch messages again
   */
  needToFetchMessages = false;
  /**
   * Private needToFetchMessages boolean, as a subject
   * Nobody outside the WebSocketService should have access to this BehaviorSubject
   * True if WebSocket succesfully reconnect after lost, which means that we must fetch messages again
   */
  private needToFetchMessagesSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Expose the observable$ part of the needToFetchMessages subject (read only stream)
   */
  public readonly needToFetchMessages$: Observable<boolean> = this.needToFetchMessagesSubject.asObservable();
  /**
   * Used to display error message to user
   */
  public lostConnection = false;
  /**
   * Used to disable retryWhen in WebSocket connection
   */
  public stopRetry = false;

  /**
   * Variables representing a part of application state, in a Redux inspired way
   */
   private messageStore: {
    messages: Message[]
  } = {
    messages: []
  };

  constructor(
    private http: HttpClient,
    protected errorHandlingService: ErrorHandlingService
  ) {
    super(errorHandlingService);
  }

  public getAllMessages(): Message[] {
    return this.messageStore.messages;
  }

  public getAllMessagesFromServer(): Observable<Message[]> {
    const url = `${this.baseUrlMessage}`;

    return this.http.get<Message[]>(url)
      .pipe(
        tap((messages: Message[]) => {
          this.messageStore.messages = messages;
          console.log(this.messageStore);
        }),
        catchError(error => this.handleError(error))
      );
    }

  public pushNewMessage(message: Message): void {
    this.messageStore.messages.push(message);
  }

  /**
   * Connection method to instanciate WebSocket communication
   */
  public connect(username: string): void {
    this.stopRetry = false;
    if (!this.socket$ || this.socket$.closed) {
      console.log('Create new WebSocket');
      this.socket$ = this.getNewWebSocket(username);
      this.socket$.pipe(
        // retryWhen(errors =>
        //   errors.pipe(
        //     tap(err => {
        //       console.error('Got error', err);
        //       console.log('[WebSocketService] (connect()) Try to reconnect');
        //       this.lostConnection = true;
        //     }),
        //     delay(RECONNECT_INTERVAL)
        //   )
        retryWhen(errors => {
          // console.log(this.stopRetry);
          // if (this.stopRetry) {
          //   console.log('stopRetry');
          //   // throwError(errors);
          //   return throwError(() => new Error('test'));
          // }

          return errors.pipe(
            tap(err => {
              console.error('Got error', err);
              console.log('[WebSocketService] (connect()) Try to reconnect');
              setTimeout(() => {
                this.lostConnection = true;
              }, 500);
            }),
            delay(RECONNECT_INTERVAL)
          );
        }),
        tap({
          error: error => {
            console.error('Socket error');
            console.log(error);
          },
        }),
        takeUntil(this.destroyed$),
        catchError(error => {
          console.log('[WebSocketService] catchError:', error);
          return EMPTY;
        })
      )
      .subscribe((msg: WebSocketMessage) => {
        this.getMessage(msg);
      });
    }
  }

  /**
   * Create a new WebSocket subject
   */
  private getNewWebSocket(username: string): WebSocketSubject<WebSocketMessage> {
    console.log('getNewWebSocket() : ', WS_ENDPOINT);

    return webSocket({
      // url: WS_ENDPOINT,
      url: `${WS_ENDPOINT}?username=${username}`,
      openObserver: {
        next: () => {
          console.log('[WebSocketService (getNewWebSocket())]: connection opened');
          // if (this.needToFetchMessages) {
          //   console.log('Reconnexion réussie => récupération des messages');
          //   this.needToFetchMessagesSubject.next(true);
          // } else {
          //   console.log('Connexion réussie => pas besoin de récupérer des messages');
          //   this.needToFetchMessages = true;
          // }
          this.needToFetchMessagesSubject.next(true);
          this.lostConnection = false;
          this.getAllMessagesFromServer().subscribe((messages: Message[]) => {
            // this.messageStore.messages = messages;
            // console.log(this.messageStore);
          });
        }
      },
      // intercepts the closure event
      closeObserver: {
        next: () => {
          console.log('[WebSocketService (getNewWebSocket())]: connection closed');
          this.lostConnection = true;
        }
      },
    });
  }

  /**
   * Get and process a message received from the socket
   */
  private getMessage(msg: WebSocketMessage): void {
    console.log(msg);
    if (msg?.data?.messageType === MessageTypes.USER_MESSAGE) {
      this.messageSubject.next(msg.data.content);
      this.pushNewMessage(msg.data);
    }
  }

  /**
   * Send a message to the socket
   */
  public sendMessage(msg: WebSocketMessage): void {
    this.socket$.next(msg);
    this.pushNewMessage(msg.data);
  }

  // test
  unsubscribe() {
    this.socket$.unsubscribe();
  }

  /**
   * Closes the connection by completing the subject
   */
  close(): void {
    console.log('[WebSocketService] - close');
    this.socket$?.complete();
    // this.destroyed$.next('');
    // this.destroyed$.complete();
    this.socket$ = undefined as any;
  }

  /**
   * OnDestroy life cycle
   */
  ngOnDestroy(): void {
    console.log('[WebSocketService] - ngOnDestroy');
    // this.close();
    this.destroyed$.next('');
    this.destroyed$.complete();
  }
}
