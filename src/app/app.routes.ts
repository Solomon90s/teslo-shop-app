import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./teslo-shop/auth/auth.routes'),
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./teslo-shop/admin-dashboard/admin-dashboard.routes'),
  },
  {
    path: '',
    loadChildren: () =>
      import('./teslo-shop/store-frontend/store-front.routes'),
  },
];
