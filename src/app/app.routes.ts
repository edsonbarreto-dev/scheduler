import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'scheduler',
    pathMatch: 'full'
  },
  {
    path: 'provider',
    loadChildren: () =>
      import('./provider/provider.routes')
        .then(routes => routes.PROVIDER_ROUTES)
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./customer/customer.routes')
        .then(routes => routes.CUSTOMER_ROUTES)
  },
  {
    path: 'booking',
    loadChildren: () =>
      import('./booking/booking.routes')
        .then(routes => routes.BOOKING_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'booking'
  }
];
