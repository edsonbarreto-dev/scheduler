import { AsyncPipe } from '@angular/common';
import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { switchMap } from 'rxjs';

import { BookingState } from '../booking-state';
import { ProviderOfferingService } from '../data-access/provider-offering.service';
import { Offering } from '../models/offering';

@Component({
  selector: 'sh-available-services',
  templateUrl: './available-services.component.html',
  styleUrls: ['./available-services.component.css'],
  standalone: true,
  imports: [AsyncPipe],
})
export class AvailableServicesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingState = inject(BookingState);
  private readonly offeringService = inject(ProviderOfferingService);

  protected readonly selectedServiceId = computed(
    () => this.bookingState.summary().serviceId
  );

  protected readonly offerings$ = this.route.parent!.paramMap.pipe(
    switchMap(params => {
      const providerId = params.get('providerId');

      if (!providerId) {
        throw new Error('providerId não informado');
      }

      return this.offeringService.getAvailableByProvider(providerId);
    })
  );

  protected selectService(offering: Offering): void {
    this.bookingState.update({
      serviceId: offering.id,
      serviceName: offering.name,
      professionalId: null,
      professionalName: null,
      date: null,
      time: null,
    });

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        serviceId: offering.id
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
