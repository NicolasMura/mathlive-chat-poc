import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { FrontendToolsModule, WINDOW } from '@mlchat-poc/frontend-tools';
import { MaterialModule } from '@mlchat-poc/vendors';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent, MessageComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SettingsComponent,
    MessageComponent
    // IosInstallComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    AppRoutingModule,
    FrontendToolsModule,
    MaterialModule
  ],
  providers: [
    {
      provide: WINDOW,
      useFactory: () => window
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
