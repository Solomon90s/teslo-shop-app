import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./teslo-shop/store-frontend/store-front.routes'),
  },
];
