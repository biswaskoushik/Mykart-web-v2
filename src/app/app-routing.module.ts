import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RouteResolveService } from './core/service/route-resolve.service';
import { CustomerPolicyComponent } from './modules/store-information/customer-policy/customer-policy.component';
import { PaymentHistoryComponent } from './modules/payment-history/payment-history.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { StoreInformationComponent } from './modules/store-information/store-information.component';
import { SubscriptionComponent } from './modules/subscription/subscription.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'seller/dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'seller/onboarding',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/onboarding/onboarding.module').then(m => m.OnboardingModule)
  },
  {
    path: 'seller/products',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/product-management/product-management.module').then(m => m.ProductManagementModule)
  },
  {
    path: 'seller/setting', component: SettingsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'seller/profile', component: ProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'seller/payment-history', component: PaymentHistoryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'seller/subscription', component: SubscriptionComponent, canActivate: [AuthGuard]
  },
  {
    path: 'seller/store-information', component: StoreInformationComponent,
    canActivate: [AuthGuard],
    resolve: { otherPolicyData: RouteResolveService },
    data: {
      requestcondition: {
        vendor: { email: '' }
      },
      endpoint: 'services/vendor/v1/policy/other/list'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteResolveService]
})

export class AppRoutingModule { }
