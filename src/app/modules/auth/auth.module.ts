import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Api Service */
import { ApiService } from '../../core/service/api.service';

/* Common Function */
import { CommonFunction } from '../../core/class/common-function';

/* Auth Guard */
import { AuthGuard } from '../../core/guards/auth.guard';

/* Routing */
import { AuthRoutingModule } from './auth-routing.module';

/* Components */
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    CommonFunction,
    AuthGuard,
    ApiService
  ]
})
export class AuthModule { }
