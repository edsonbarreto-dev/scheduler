import { Routes } from '@angular/router';

export const BOOKING_ROUTES: Routes = [
  {
    path: ':providerId',
    loadComponent: () =>
      import('./booking.component')
        .then(c => c.BookingComponent),

    children: [
      {
        path: '',
        redirectTo: 'services',
        pathMatch: 'full'
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./available-services/available-services.component')
            .then(c => c.AvailableServicesComponent)
      },
      {
        path: 'service/:serviceId',
        children: [
          {
            path: '',
            redirectTo: 'available-professionals',
            pathMatch: 'full'
          },
          {
            path: 'available-professionals',
            loadComponent: () =>
              import('./available-professionals/available-professionals.component')
                .then(c => c.AvailableProfessionalsComponent)
          },
          {
            path: 'date',
            loadComponent: () =>
              import('./available-dates/available-dates.component')
                .then(c => c.AvailableDatesComponent)
          },
          {
            path: 'date/:date/time',
            loadComponent: () =>
              import('./available-hours/available-hours.component')
                .then(c => c.AvailableHoursComponent)
          }
        ]
      }
    ]
  }
];
