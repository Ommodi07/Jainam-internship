import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from '../../../cms-lib/src/gaurds/auth.guard';
import { LoginGuard } from '../../../cms-lib/src/gaurds/login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate : [LoginGuard]},
  { path: 'creditcards', loadChildren: () => import('./components/creditcards/creditcards.module').then(m => m.CreditcardsModule), canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
