import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingProfileComponent } from './modules/onboarding/pages/onboarding-profile/onboarding-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaticDataSource } from './core/data/staticDataSource';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MaterialModule } from './material-module';
// import { HeaderComponent } from './core/layouts/fontend/header/header.component';

@NgModule({
    declarations: [
        OnboardingProfileComponent,
        // HeaderComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiSwitchModule,
        MaterialModule
    ],
    exports: [
        OnboardingProfileComponent,
        UiSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        // HeaderComponent
    ],
    providers: [StaticDataSource],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class ShareModule { }