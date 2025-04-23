import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./teslo-shop/auth/auth.routes'),
  },
  {
    path: '',
    loadChildren: () =>
      import('./teslo-shop/store-frontend/store-front.routes'),
  },
];
