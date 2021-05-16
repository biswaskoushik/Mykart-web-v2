import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Auth Guard */
import { AuthGuard } from '../../core/guards/auth.guard';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { ListCategoryComponent } from './category/list-category/list-category.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { RouteResolveService } from '../../core/service/route-resolve.service';

/* Page Components */

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ListProductComponent,
    resolve: { categoryList: RouteResolveService },
    data: {
      requestcondition: {
        source: '',
        "Vendor_detail": {
          "email": ""
        }
      },
      endpoint: 'services/vendor/v1/category/list'
    }
  },

  {
    path: 'add',
    canActivate: [AuthGuard],
    component: AddProductComponent
  },

  {
    path: 'edit/:product_id',
    canActivate: [AuthGuard],
    component: AddProductComponent
  },

  {
    path: 'categories/add',
    canActivate: [AuthGuard],
    component: AddCategoryComponent
  },

  {
    path: 'categories',
    canActivate: [AuthGuard],
    component: ListCategoryComponent,
    resolve: { categoryList: RouteResolveService },
    data: {
      requestcondition: {
        source: '',
        "Vendor_detail": {
          "email": ""
        }
      },
      endpoint: 'services/vendor/v1/category/list'
    }
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ProductManagementRoutingModule { }
