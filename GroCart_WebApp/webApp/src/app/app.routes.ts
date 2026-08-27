import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FlashSaleManagerComponent } from './features/flash-sale/flash-sale-manager.component';
import { ProductsManagerComponent } from './features/products/products-manager.component';

export const routes: Routes = [{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }, { path: 'dashboard', component: DashboardComponent }, { path: 'flash-sales', component: FlashSaleManagerComponent }, { path: 'products', component: ProductsManagerComponent }];
