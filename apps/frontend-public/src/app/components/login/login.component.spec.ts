import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { FrontendToolsModule, UserService, NotificationService} from '@mlchat-poc/frontend-tools';
import { MaterialModule } from '@mlchat-poc/vendors';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  const userServiceMock = {
    getCurrentUser: jest.fn(),
    login: jest.fn(),
  };
  const notificationServiceMock = {
    sendNotification: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FrontendToolsModule,
        MaterialModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend-public'`, () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    // expect(app.title).toEqual('frontend-public');
  });

  xit('should render title', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to frontend-public!'
    );
  });
});
