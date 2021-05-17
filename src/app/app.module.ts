import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Common Function */
import { CommonFunction } from './core/class/common-function';

/* Fontend Design */
import { FontendComponent } from './core/layouts/fontend/fontend.component';
import { HeaderComponent } from './core/layouts/fontend/header/header.component';
import { FooterComponent } from './core/layouts/fontend/footer/footer.component';
import { LeftMenuComponent } from './core/layouts/fontend/left-menu/left-menu.component';

/* Auth Design */
import { AuthComponent } from './core/layouts/auth/auth.component';

// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { MaterialModule } from './material-module';
import { SettingsComponent } from './modules/settings/settings.component';
import { ShareModule } from './share.module';
import { ProfileComponent } from './modules/profile/profile.component';
import { SubscriptionComponent } from './modules/subscription/subscription.component';
import { PaymentHistoryComponent } from './modules/payment-history/payment-history.component';
import { CustomerPolicyComponent } from './modules/store-information/customer-policy/customer-policy.component';
import { StoreInformationComponent } from './modules/store-information/store-information.component';
import { AddNewCardComponent } from './modules/subscription/add-new-card/add-new-card.component';
import { PolicyAddEditComponent } from './modules/store-information/policy-add-edit/policy-add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LeftMenuComponent,
    AuthComponent,
    FontendComponent,
    SettingsComponent,
    ProfileComponent,
    SubscriptionComponent,
    PaymentHistoryComponent,
    CustomerPolicyComponent,
    StoreInformationComponent,
    AddNewCardComponent,
    PolicyAddEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MaterialModule,
    ShareModule
  ],
  exports: [
    HeaderComponent,
    LeftMenuComponent
  ],
  providers: [
    CommonFunction,HeaderComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
