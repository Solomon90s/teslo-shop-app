import { Routes } from '@angular/router';
import { ProductAdminPageComponent } from './pages/product-admin-page/product-admin-page.component';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard/admin-dashboard-layout.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductAdminPageComponent,
      },
      {
        path: 'product/:id',
        component: ProductAdminPageComponent,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
  },
];

export default adminDashboardRoutes;
