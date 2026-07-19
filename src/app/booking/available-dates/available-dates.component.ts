import { AsyncPipe } from '@angular/common';

import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  combineLatest,
  switchMap,
  tap
} from 'rxjs';

import { BookingState } from '../booking-state';

import {
  ProviderAvailableService
} from '../data-access/provider-available.service';

import {
  AvailableDate
} from '../models/available-date';

@Component({
  selector: 'sh-available-dates',
  templateUrl: './available-dates.component.html',
  styleUrls: ['./available-dates.component.css'],
  standalone: true,
  imports: [
    AsyncPipe
  ]
})
export class AvailableDatesComponent {
  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly bookingState =
    inject(BookingState);

  private readonly availableService =
    inject(ProviderAvailableService);

  protected readonly selectedDate = computed(
    () => this.bookingState.summary().date
  );

  protected readonly dates$ = combineLatest([
    this.route.parent!.parent!.paramMap,
    this.route.parent!.paramMap,
    this.route.queryParamMap
  ]).pipe(
    switchMap(
      ([
         providerParams,
         serviceParams,
         queryParams
       ]) => {
        const providerId =
          providerParams.get('providerId');

        const serviceId =
          serviceParams.get('serviceId');

        const professionalId =
          queryParams.get('professionalId');

        if (!providerId) {
          throw new Error(
            'providerId não informado'
          );
        }

        if (!serviceId) {
          throw new Error(
            'serviceId não informado'
          );
        }

        return this.availableService
          .getAvailableDates(
            providerId,
            serviceId,
            professionalId
          );
      }
    ),

    tap(dates => {
      const selectedDate =
        this.bookingState.summary().date;

      if (!selectedDate) {
        return;
      }

      const remainsAvailable = dates.some(
        availableDate =>
          availableDate.date === selectedDate
      );

      if (remainsAvailable) {
        return;
      }

      this.bookingState.update({
        date: null,
        time: null
      });

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          date: null
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    })
  );

  protected selectDate(
    availableDate: AvailableDate
  ): void {
    this.bookingState.update({
      date: availableDate.date,
      time: null
    });

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        date: availableDate.date
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  protected formatWeekday(
    isoDate: string
  ): string {
    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        weekday: 'long'
      }
    ).format(
      this.parseLocalDate(isoDate)
    );
  }

  protected formatDate(
    isoDate: string
  ): string {
    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long'
      }
    ).format(
      this.parseLocalDate(isoDate)
    );
  }

  private parseLocalDate(
    isoDate: string
  ): Date {
    const [year, month, day] =
      isoDate
        .split('-')
        .map(Number);

    return new Date(
      year,
      month - 1,
      day,
      12
    );
  }
}
