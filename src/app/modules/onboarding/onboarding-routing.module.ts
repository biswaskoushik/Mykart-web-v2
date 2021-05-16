import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Auth Guard */
import { AuthGuard } from '../../core/guards/auth.guard';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';

/* Page Components */

const routes: Routes = [
  { 
    path: '', 
    canActivate: [AuthGuard],
    component: OnboardingComponent 
  },
  { 
    path: 'stripe', 
    canActivate: [AuthGuard],
    component: OnboardingComponent 
  },
  {
    path:'**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class OnboardingRoutingModule { }
