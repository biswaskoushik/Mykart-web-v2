import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductManagementRoutingModule} from '../product-management/product-management-routing.module';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { ListCategoryComponent } from './category/list-category/list-category.component'
import { MaterialModule } from '../../material-module';
import { ShareModule } from '../../share.module';
import { ManageVariantComponent } from './product/manage-variant/manage-variant.component';


@NgModule({
  declarations: [AddProductComponent, ListProductComponent, AddCategoryComponent, ListCategoryComponent,ManageVariantComponent],
  imports: [
    CommonModule,
    ProductManagementRoutingModule,
    ShareModule,
    MaterialModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class ProductManagementModule { }
