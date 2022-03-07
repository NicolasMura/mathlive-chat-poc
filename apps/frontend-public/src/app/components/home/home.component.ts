import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, Input, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MathfieldElement} from 'mathlive';
import { UserService, UtilitiesService, WebSocketService, WebSocketMessage, Message } from '@mlchat-poc/frontend-tools';
import { User, MessageTypes } from '@mlchat-poc/models';
import { catchError, tap } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'mlchat-poc-message',
  template: `
    <div class="message" [ngClass]="{ 'align-right': message.sender === user.username }">
      <img [src]="'https://avatars.dicebear.com/api/avataaars/' + message.sender + '.svg'"
         alt="{{ message.sender + ' avatar' }}"
         title="{{ message.sender + ' avatar' }}">
      <div *ngIf="!message.isMathliveContent">
        {{ message.content }}
      </div>
      <div #mathfield class="scrollable" style="display: flex;"
           [style.justify-content]="message.sender === user.username ? 'end' : 'start'"
           [style.visibility]="message.isMathliveContent ? 'visible' : 'hidden'"
           [style.height]="message.isMathliveContent ? 'auto' : '0px'">
      </div>
    </div>
  `,
  styles: [`
    .message {
      &.align-right {
        text-align: right;
      }
      img {
        max-width: 50px;
      }
      .scrollable {
        pointer-events: none; /* to allow page scrolling on mobile device */
      }
    }
    ::ng-deep {
      .message {
        math-field {
          font-size: inherit;
          padding: inherit;
          border: none;
          box-shadow: none;
        }
      }
    }
  `]
})
export class MessageComponent implements OnInit, AfterViewInit {
  @Input() message!: Message;
  @Input() i!: number;
  @Input() user!: User;

  /**
   * Mathfield element
   */
  mfe = new MathfieldElement();
  /**
   * Reference to mathfield input
   */
  @ViewChild('mathfield') mathfield!: ElementRef;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    // console.log(this.message.isMathliveContent);
    if (this.message.isMathliveContent) {
      // this.mfe.value = "x=\\frac{-b\\pm \\sqrt{b^2-4ac}}{2a}";
      // console.log(this.message.content);
      this.mfe.value = this.message.content;
      // console.log(this.mfe);
      this.mfe.setOptions({
        readOnly: true,
        virtualKeyboardMode: 'off',
        fontsDirectory: './assets/fonts',
        soundsDirectory: './assets/sounds'
      });
    }
  }

  ngAfterViewInit(): void {
    this.renderer.appendChild(this.mathfield.nativeElement, this.mfe);
  }
}


@Component({
  selector: 'mlchat-poc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  /**
   * User input form
   */
  messageForm!: FormGroup;
  /**
   * Reference to input
   */
  input!: ElementRef;
  /**
   * Setter for input (autofocus - desktop mode)
   */
  @ViewChild('input') set _input(input: ElementRef) {
    if (input && !this.input) {
      setTimeout(() => {
        this.input = input;
        input.nativeElement.focus();
      }, 100);
    }
  };
  /**
   * Reference to input material FormField
   */
  userInputFormfield!: MatFormField;
  /**
   * Setter for input material FormField
   */
  @ViewChild('userInputFormfield') set _userInputFormfield(input: MatFormField) {
    if (input) {
      this.userInputFormfield = input;
      setTimeout(() => {
        this.mfeWidth = this.userInputFormfield._elementRef.nativeElement.offsetWidth;
      }, 100);
    }
  }
  /**
   * Mathfield element
   */
  mfe = new MathfieldElement();
  /**
   * Mathfield element width
   */
  mfeWidth!: number;
  /**
   * Actions bar element height
   */
  actionsBarHeight = 64;
  /**
   * Virtual keyboard element height
   */
  virtualKeyboardHeight!: number;
  /**
   * Reference to mathfield input
   */
  @ViewChild('mathfield') mathfield!: ElementRef;
  /**
   * Tell us if Mathlive Virtual Keyboard is displayed or not
   */
  isVirtualKeyboardDisplayed = false;
  /**
   * Toggle mode between normal (text input) and Mathlive
   */
  modeMathlive = false;
  /**
   * Standard user input (text)
   */
  standardInput = '';
  /**
   * Mathlive user input (LateX)
   */
  mathInput = '';
  /**
   * Reference to messages container for scrolling convenience
   */
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  /**
   * @TODO see if useful or not
   * Reference to messages
   */
  @ViewChildren('messages') messages!: QueryList<any>;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    public userService: UserService,
    public webSocketService: WebSocketService,
    public utilitiesService: UtilitiesService
    ) {}

  ngOnInit(): void {
    // this.webSocketService.getAllMessagesFromServer().subscribe();;

    this.messageForm = new FormGroup({
      message: new FormControl('', Validators.required)
    });

    this.userService.getAllUsersFromBackend().subscribe((users: User[]) => {
      // console.log(users);
    });

    // subscribe to WebSocket messages
    this.webSocketService.message$.pipe(
      tap({
        error: error => console.log('[HomeComponent] Error:', error),
        complete: () => console.log('[HomeComponent] Connection Closed')
      }),
      catchError(error => {
        console.log('[HomeComponent] catchError:', error);
        throw error;
      })
    ).subscribe((message: string) => {
      console.log(message);
    });

    // subscribe to WebSocket reconnection to update view
    this.webSocketService.needToFetchMessages$.subscribe((reconnect: boolean) => {
      if (reconnect) {
        this.webSocketService.getAllMessagesFromServer().subscribe((messages: Message[]) => {
          // automatic scroll to bottom to show last messages
          // @TODO marche pas
          console.log('GOOOO');
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        });
      }
    });

    // this.mfe.value = "x=\\frac{-b\\pm \\sqrt{b^2-4ac}}{2a}";
    this.mfe.value = "";
    this.mathInput = this.mfe.value;
    this.mfe.setOptions({
      virtualKeyboardMode: 'manual', // onfocus
      // readOnly: true
      fontsDirectory: './assets/fonts',
      soundsDirectory: './assets/sounds',
      virtualKeyboardTheme: 'material', // apple
      // keybindings: [{
      //   "key": 'cmd+enter',
      //   // ifPlatform: 'macos',
      //   "command": ['insert', '\\sqrt{#0}'],
      //   // command: ['selectAll'],
      // }]
    });
  }

  ngAfterViewInit(): void {
    this.renderer.appendChild(this.mathfield.nativeElement, this.mfe);

    this.mfe.addEventListener('input', (event: Event) => {
      // adjust actions bar height
      setTimeout(() => {
        this.actionsBarHeight = this.mfe.clientHeight + 20; // 20px padding
      }, 200);

      this.messageForm.patchValue({ message: this.mfe.value });
    });

    this.mfe.addEventListener('virtual-keyboard-toggle', (event: Event) => {
      setTimeout(() => {
        this.isVirtualKeyboardDisplayed = this.mfe.virtualKeyboardState === 'visible' || false;
        this.toggleVirtualKeyboardToggleVisibility(this.isVirtualKeyboardDisplayed);

        // move actions bar to virtual keyboard height
        this.virtualKeyboardHeight = document.querySelector('.ML__keyboard')?.firstElementChild?.clientHeight || 0;
      }, 200); // needed to get toggleMathFieldVirtualKeyboard working and to have enough time when click on "send" button
    });

    this.messages?.changes.subscribe((newMessage: any) => {
      // console.log(newMessage);
    });
  }

  public toggleVirtualKeyboardToggleVisibility(isVirtualKeyboardDisplayed: boolean): void {
    const virtualKeyboardElement = this.el.nativeElement.querySelector('.mathfield-wrapper math-field');
    const shadow = virtualKeyboardElement.shadowRoot;
    const keyboardToggle = shadow.querySelector('.ML__virtual-keyboard-toggle');

    if (isVirtualKeyboardDisplayed) {
      keyboardToggle.style.visibility = 'hidden';
    } else {
      if (this.modeMathlive) {
        keyboardToggle.style.visibility = 'visible';
      } else {
        keyboardToggle.style.visibility = 'hidden';
      }
    }
  }

  public sortMessagesByUnixDate(messages: Message[]): Message[] {
    return messages.sort((m1: Message, m2: Message) => {
      if (m1.createdAt > m2.createdAt) { return -1 };
      if (m1.createdAt <= m2.createdAt) { return 1 };
      return 0;
    });
  }

  public toggleMathFieldVirtualKeyboard(): void {
    this.mfeWidth = this.userInputFormfield._elementRef.nativeElement.offsetWidth;

    if (!this.isVirtualKeyboardDisplayed) {
      const virtualKeyboardElement = this.el.nativeElement.querySelector('.mathfield-wrapper math-field');
      const shadow = virtualKeyboardElement.shadowRoot;
      const keyboardToggle = shadow.querySelector('.ML__virtual-keyboard-toggle');
      keyboardToggle.click();
    }
  }

  public toggleMathFieldMode(): void {
    this.modeMathlive = !this.modeMathlive;

    // save data and switch mode
    if (this.modeMathlive) {
      this.standardInput = this.messageForm.get('message')?.value;
      this.messageForm.patchValue({ message: this.mathInput });

      setTimeout(() => {
        // adjust actions bar height
        this.actionsBarHeight = this.mfe.clientHeight + 20; // 20px padding

        this.toggleMathFieldVirtualKeyboard();
      }, 200); // needed to get actions bar height update + focus on #mathfield
    } else {
      this.mathInput = this.messageForm.get('message')?.value;
      this.messageForm.patchValue({ message: this.standardInput });

      setTimeout(() => {
        // reinitialize actions bar height
        this.actionsBarHeight = 64;

        this.input.nativeElement.focus();
      }, 200); // needed to get actions bar height update + focus on input

      const virtualKeyboardElement = this.el.nativeElement.querySelector('.mathfield-wrapper math-field');
      const shadow = virtualKeyboardElement.shadowRoot;
      const keyboardToggle = shadow.querySelector('.ML__virtual-keyboard-toggle');
      keyboardToggle.style.visibility = 'hidden';
    }
  }

  public sendMessage(): void {
    if (this.messageForm.valid && !this.webSocketService.lostConnection) {
      if (this.modeMathlive) {
        this.messageForm.patchValue({ message: this.mfe.value });
      }

      this.webSocketService.sendMessage(new WebSocketMessage(
        'chatMessage',
        {
          messageType: MessageTypes.USER_MESSAGE,
          isBroadcast: false,
          sender: this.userService.getCurrentUser().username,
          createdAt: moment().unix().toString(),
          content: this.messageForm.get('message')?.value,
          isMathliveContent: this.modeMathlive
        }
      ));

      this.messageForm.reset();
      this.standardInput = '';
      this.mfe.value = '';
      this.input.nativeElement.focus();

      // automatic scroll to bottom to show last messages
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }

  /**
   * Scroll to the end of messages list
   */
  scrollToBottom = () => {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight + 50;  // 20px padding
    }
    // try {
    //   this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight + 50;  // 20px padding
    // } catch (err) {
    //   console.log(err);
    // }
  }

  /**
   * Scan for CTRL + Enter event for quick login access
   * @TODO semble entrer en conflit avec les shortcuts du virtual keyboard apple / android
   * @TODO à désactiver sur Firefox (effet de bord: activation du mode math...)
   */
  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent): void {
    if (($event.ctrlKey || $event.metaKey) && $event.code === 'Enter') {
      // this.input.nativeElement.focus();
      this.sendMessage();
    }
  }
}
