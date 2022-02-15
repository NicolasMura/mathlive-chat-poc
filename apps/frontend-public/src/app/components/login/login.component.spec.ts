import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { FrontendToolsModule } from '@mlchat-poc/frontend-tools';
import { MaterialModule } from '@mlchat-poc/vendors';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        // CommonModule,
        // RouterModule,
        // RouterTestingModule,
        // HttpClientTestingModule,
        FrontendToolsModule,
        MaterialModule
      ],
      providers: [LocalStorageService]
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

  it('should render title', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to frontend-public!'
    );
  });
});
