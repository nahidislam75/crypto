import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'coin-list', pathMatch: 'full' },
  {
    path: 'coin-list',
    loadComponent: () =>
      import('./components/coin-list/coin-list.component').then(
        (m) => m.CoinListComponent
      ),
  },
  {
    path: 'coin-detail/:id',
    loadComponent: () =>
      import('./components/coin-detail/coin-detail.component').then(
        (m) => m.CoinDetailComponent
      ),
  },
];
