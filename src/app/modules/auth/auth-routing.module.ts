import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Auth Guard */
import { AuthGuard } from '../../core/guards/auth.guard';

/* Components */
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent 
  },
  { 
    path: 'signup',
    component: RegisterComponent
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  { 
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule) 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
