import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Auth Guard */
import { AuthGuard } from '../../core/guards/auth.guard';

/* Page Components */
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { 
    path: '', 
    canActivate: [AuthGuard],
    component: DashboardComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DashboardRoutingModule { }
