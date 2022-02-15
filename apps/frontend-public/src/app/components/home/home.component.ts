import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewChildren, QueryList, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MathfieldElement} from 'mathlive';
import { UserService, UtilitiesService, WebSocketService, WebSocketMessage, Message } from '@mlchat-poc/frontend-tools';
import { User, MessageTypes } from '@mlchat-poc/models';
import { catchError, tap } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'mlchat-poc-message',
  template: `
    <div [ngClass]="{ 'align-right': message.sender === user.username }">
      <div *ngIf="!message.isMathliveContent">({{ i }}) - {{ message.sender }} : {{ message.content }} ({{ message.isMathliveContent ? 'math' : 'standard'}})</div>
      <!-- <div>({{ i }}) - {{ message.sender }} : {{ message.content }} ({{ message.isMathliveContent ? 'math' : 'standard'}})</div> -->
      <!-- <div #mathfield class="mathfield-wrapper" [style.visibility]="modeMathlive ? 'visible' : 'hidden'"></div> -->
      <div>{{ mfe.value }}</div>
      <div #mathfield
           [style.visibility]="message.isMathliveContent ? 'visible' : 'hidden'"
           [style.height]="message.isMathliveContent ? 'auto' : '0px'">
      </div>
    </div>
  `,
  styles: [`
    h1 {
      font-weight: normal;
    }
    .align-right {
      text-align: right;
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
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    console.log(this.message.isMathliveContent);
    if (this.message.isMathliveContent) {
      // this.mfe.value = "x=\\frac{-b\\pm \\sqrt{b^2-4ac}}{2a}";
      console.log(this.message.content);
      this.mfe.value = this.message.content;
      console.log(this.mfe);
      this.mfe.setOptions({
        readOnly: true,
        fontsDirectory: '/assets/fonts/mathlive',
        soundsDirectory: '/assets/sounds'
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
   * Reference to title input for autofocus (desktop mode)
   */
  @ViewChild('input', { static: true }) input!: ElementRef;
  /**
   * Mathfield element
   */
  mfe = new MathfieldElement();
  /**
   * Reference to mathfield input
   */
  @ViewChild('mathfield') mathfield!: ElementRef;
  /**
   * Get multiple MessageComponent dynamically
   */
  @ViewChildren(MessageComponent) set msgComponents(messagesComponents: QueryList<MessageComponent>) {
  // @ViewChildren(MessageComponent) set msgComponents(messagesComponents: QueryList<ElementRef<MessageComponent>>) {
  // @ViewChildren(ElementRef) set msgComponents(messagesComponents: QueryList<ElementRef>) {
    console.log(messagesComponents);

    if (messagesComponents) {
      messagesComponents.forEach((msgComponent: MessageComponent) => {
      // messagesComponents.forEach((msgComponent: ElementRef<MessageComponent>) => {
        // console.log(msgComponent);
        if (msgComponent.message.isMathliveContent) {
          console.log(msgComponent);
          // console.log(this.);
        // if (msgComponent.nativeElement.message.isMathliveContent) {
        //   this.renderer.appendChild(msgComponent.nativeElement, this.mfe);
        }
      });
    }
    // this.matChipLists = matChipLists;

    // if (matChipLists) {
    //   if (!this.matChipListsSubscriptions) {
    //     matChipLists.forEach((mcl: MatChipList, index: number) => {
    //       // Trigger manually error state on chip lists
    //       const newSub: RxjsSubscription = (this.servicePriceForm.controls.propertiesPrice as FormArray)
    //         .at(index)
    //         .get('propertyValues').statusChanges.subscribe((status: string) => {
    //           this.matChipLists.find((m: MatChipList, i: number) => i === index).errorState = status === 'INVALID';
    //         });

    //       (this.matChipListsSubscriptions || (this.matChipListsSubscriptions = [])).push(newSub);
    //     });
    //   }
    // }
  };
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
      message: new FormControl('')
    });
    this.input.nativeElement.focus();

    this.userService.getAllUsersFromBackend().subscribe((users: User[]) => {
      console.log(users);
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
        this.webSocketService.getAllMessagesFromServer();
      }
    });

    // this.mfe.value = "x=\\frac{-b\\pm \\sqrt{b^2-4ac}}{2a}";
    this.mfe.value = "";
    this.mathInput = this.mfe.value;
    console.log(this.mfe);
    this.mfe.setOptions({
      // virtualKeyboardMode: 'onfocus',
      virtualKeyboardMode: 'manual',
      // readOnly: true
      fontsDirectory: '/assets/fonts/mathlive',
      soundsDirectory: '/assets/sounds'
    });
  }

  ngAfterViewInit(): void {
    this.renderer.appendChild(this.mathfield.nativeElement, this.mfe);

    this.mfe.addEventListener('input', (test: Event) => {
      console.log(test);
      this.messageForm.patchValue({ message: this.mfe.value });
    });

    this.mfe.addEventListener('virtual-keyboard-toggle', (test: Event) => {
      // console.log(test);
      // console.log(document.querySelector('.ML__keyboard.is-visible'));
      // console.log(this.mfe.virtualKeyboardState);
      setTimeout(() => {
        this.isVirtualKeyboardDisplayed = this.mfe.virtualKeyboardState === 'visible' || false;
      }, 200); // needed to get toggleMathFieldVirtualKeyboard working
    });
  }

  public sortMessagesByUnixDate(messages: Message[]): Message[] {
    return messages.sort((m1: Message, m2: Message) => {
      if (m1.createdAt > m2.createdAt) { return -1 };
      if (m1.createdAt <= m2.createdAt) { return 1 };
      return 0;
    });
  }

  public toggleMathFieldVirtualKeyboard(): void {
    if (!this.isVirtualKeyboardDisplayed) {
      const virtualKeyboardElement = this.el.nativeElement.querySelector('math-field');
      const shadow = virtualKeyboardElement.shadowRoot;
      const keyboard = shadow.querySelector('.ML__virtual-keyboard-toggle');
      // console.log(keyboard);
      keyboard.click();
    }
  }

  public toggleMathFieldMode(): void {
    this.modeMathlive = !this.modeMathlive;

    // save data and switch mode
    if (this.modeMathlive) {
      this.standardInput = this.messageForm.get('message')?.value;
      this.messageForm.patchValue({ message: this.mathInput });
      setTimeout(() => {
        this.toggleMathFieldVirtualKeyboard();
      }, 200); // needed to get focus on #mathfield
    } else {
      this.mathInput = this.messageForm.get('message')?.value;
      this.messageForm.patchValue({ message: this.standardInput });
    }
  }

  public sendMessage(): void {
    if (this.messageForm.valid && !this.webSocketService.lostConnection) {
      if (this.modeMathlive) {
        this.messageForm.patchValue({ message: this.mfe.value });
        // this.mfe.value = '';
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
      this.input.nativeElement.focus();
    }
  }

  /**
   * Scan for CTRL + Enter event for quick login access
   */
  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent): void {
    if (($event.ctrlKey || $event.metaKey) && $event.code === 'Enter') {
      // this.input.nativeElement.focus();
      this.sendMessage();
    }
  }
}
