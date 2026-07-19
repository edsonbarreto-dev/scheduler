import {
  Component,
  inject
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import {
  toSignal
} from '@angular/core/rxjs-interop';

import {
  filter,
  map,
  startWith
} from 'rxjs';

import { BookingState } from './booking-state';

import {
  BookingStateHydrator
} from './booking-state-hydrator.service';

import {
  ProviderOfferingService
} from './data-access/provider-offering.service';

@Component({
  selector: 'sh-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone: true,
  imports: [
    RouterOutlet
  ],
  providers: [
    BookingState,
    ProviderOfferingService,
    BookingStateHydrator
  ]
})
export class BookingComponent {
  protected readonly bookingState =
    inject(BookingState);

  private readonly router =
    inject(Router);

  private readonly stateHydrator =
    inject(BookingStateHydrator);

  protected readonly steps = [
    {
      id: 1,
      label: 'Serviço'
    },
    {
      id: 2,
      label: 'Profissional'
    },
    {
      id: 3,
      label: 'Data'
    },
    {
      id: 4,
      label: 'Horário'
    }
  ] as const;

  protected readonly currentStep = toSignal(
    this.router.events.pipe(
      filter(
        (event): event is NavigationEnd =>
          event instanceof NavigationEnd
      ),

      startWith(null),

      map(() =>
        this.resolveCurrentStep(this.router.url)
      )
    ),
    {
      initialValue: 1
    }
  );

  constructor() {
    this.stateHydrator.start();
  }

  protected confirmBooking(): void {
  }

  protected next(): void {
    const step = this.currentStep();
    const summary = this.bookingState.summary();
    const context = this.stateHydrator.context();

    if (!context.providerId) {
      return;
    }

    switch (step) {
      case 1:
        if (!summary.serviceId) {
          return;
        }

        void this.router.navigate([
          '/booking',
          context.providerId,
          'service',
          summary.serviceId,
          'professional'
        ]);

        break;

      case 2: {
        const serviceId =
          context.serviceId ?? summary.serviceId;

        if (!serviceId) {
          return;
        }

        void this.router.navigate(
          [
            '/booking',
            context.providerId,
            'service',
            serviceId,
            'date'
          ],
          {
            queryParams: summary.professionalId
              ? {
                professionalId:
                summary.professionalId
              }
              : undefined
          }
        );

        break;
      }

      case 3: {
        const serviceId =
          context.serviceId ?? summary.serviceId;

        if (!serviceId || !summary.date) {
          return;
        }

        void this.router.navigate(
          [
            '/booking',
            context.providerId,
            'service',
            serviceId,
            'date',
            summary.date,
            'time'
          ],
          {
            queryParams: summary.professionalId
              ? {
                professionalId:
                summary.professionalId
              }
              : undefined
          }
        );

        break;
      }
    }
  }

  protected back(): void {
    const step = this.currentStep();
    const summary = this.bookingState.summary();
    const context = this.stateHydrator.context();

    if (!context.providerId) {
      return;
    }

    switch (step) {
      case 2: {
        const serviceId =
          context.serviceId ?? summary.serviceId;

        void this.router.navigate(
          [
            '/booking',
            context.providerId,
            'services'
          ],
          {
            queryParams: serviceId
              ? { serviceId }
              : undefined
          }
        );

        break;
      }

      case 3: {
        const serviceId =
          context.serviceId ?? summary.serviceId;

        if (!serviceId) {
          return;
        }

        void this.router.navigate(
          [
            '/booking',
            context.providerId,
            'service',
            serviceId,
            'professional'
          ],
          {
            queryParams: context.professionalId
              ? {
                professionalId:
                context.professionalId
              }
              : undefined
          }
        );

        break;
      }

      case 4: {
        const serviceId =
          context.serviceId ?? summary.serviceId;

        if (!serviceId) {
          return;
        }

        void this.router.navigate(
          [
            '/booking',
            context.providerId,
            'service',
            serviceId,
            'date'
          ],
          {
            queryParams: {
              professionalId:
                context.professionalId ?? undefined,

              date:
                context.date ?? undefined
            }
          }
        );

        break;
      }
    }
  }

  private resolveCurrentStep(url: string): number {
    if (/\/date\/[^/]+\/time/.test(url)) {
      return 4;
    }

    if (url.includes('/date')) {
      return 3;
    }

    if (url.includes('/professional')) {
      return 2;
    }

    return 1;
  }
}
