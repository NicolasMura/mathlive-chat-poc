import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoggedGuard } from '@mlchat-poc/frontend-tools';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SomethingIsBrokenComponent } from '@mlchat-poc/frontend-tools';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [ UserLoggedGuard ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [ UserLoggedGuard ]
  },
  {
    path: '**',
    component: SomethingIsBrokenComponent,
    canActivate: [ UserLoggedGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
