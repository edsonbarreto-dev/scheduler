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
  AvailableTime
} from '../models/available-time';

@Component({
  selector: 'sh-available-hours',
  templateUrl: './available-hours.component.html',
  styleUrls: ['./available-hours.component.css'],
  standalone: true,
  imports: [
    AsyncPipe
  ]
})
export class AvailableHoursComponent {
  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly bookingState =
    inject(BookingState);

  private readonly availableService =
    inject(ProviderAvailableService);

  protected readonly selectedTime = computed(
    () => this.bookingState.summary().time
  );

  protected readonly times$ = combineLatest([
    this.route.parent!.parent!.paramMap,
    this.route.parent!.paramMap,
    this.route.paramMap,
    this.route.queryParamMap
  ]).pipe(
    switchMap(
      ([
         providerParams,
         serviceParams,
         dateParams,
         queryParams
       ]) => {
        const providerId =
          providerParams.get('providerId');

        const serviceId =
          serviceParams.get('serviceId');

        const date =
          dateParams.get('date');

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

        if (!date) {
          throw new Error(
            'date não informada'
          );
        }

        return this.availableService
          .getAvailableTimes(
            providerId,
            serviceId,
            date,
            professionalId
          );
      }
    ),

    tap(times => {
      const selectedTime =
        this.bookingState.summary().time;

      if (!selectedTime) {
        return;
      }

      const remainsAvailable = times.some(
        availableTime =>
          availableTime.start === selectedTime
      );

      if (remainsAvailable) {
        return;
      }

      this.bookingState.update({
        time: null
      });

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          time: null
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    })
  );

  protected selectTime(
    availableTime: AvailableTime
  ): void {
    this.bookingState.update({
      time: availableTime.start
    });

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        time: availableTime.start
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
