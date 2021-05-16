import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Common Function */
import { CommonFunction } from '../../core/class/common-function';

/* Auth Guard */
import { AuthGuard } from '../../core/guards/auth.guard';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
// import { OnboardingProfileComponent } from './pages/onboarding-profile/onboarding-profile.component';
import { OnboardingPoliciesComponent } from './pages/onboarding-policies/onboarding-policies.component';
import { OnboardingSubscriptionComponent } from './pages/onboarding-subscription/onboarding-subscription.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaticDataSource } from '../../core/data/staticDataSource'
import { MaterialModule } from '../../material-module';
import { CardDirective } from '../../core/directives/card.directive';
import { ShareModule } from '../../share.module';

@NgModule({
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ShareModule,
  ],
  declarations: [
    OnboardingComponent,
    // OnboardingProfileComponent,
    OnboardingPoliciesComponent,
    OnboardingSubscriptionComponent,
    CardDirective
  ],
  providers: [
    CommonFunction,
    AuthGuard,
    StaticDataSource
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingModule { }
