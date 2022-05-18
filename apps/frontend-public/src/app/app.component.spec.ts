import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@mlchat-poc/vendors';
import { of } from 'rxjs';
import { UserService, UtilitiesService } from '@mlchat-poc/frontend-tools';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const userServiceMock = {
    checkForExistingUsername: jest.fn(),
    logout: jest.fn(),
    currentUser$: '???',
  };
  const utilitiesServiceMock = {
    isAppInMaintenanceMode: jest.fn().mockReturnValue(of(false))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MaterialModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: UtilitiesService, useValue: utilitiesServiceMock },
      ]
    }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`has as title 'frontend-public'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend-public');
  });
});
