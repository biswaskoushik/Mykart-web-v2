import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Common Function */
import { CommonFunction } from '../../core/class/common-function';

/* Auth Guard */
import { AuthGuard } from '../../core/guards/auth.guard';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { HeaderComponent } from '../../core/layouts/fontend/header/header.component';
import { LeftMenuComponent } from '../../core/layouts/fontend/left-menu/left-menu.component';
import { ShareModule } from '../../share.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ShareModule
  ],
  exports: [
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    CommonFunction,
    AuthGuard
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class DashboardModule { }
