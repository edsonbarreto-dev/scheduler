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
  ProviderProfessionalService
} from '../data-access/provider-professional.service';

import {
  Professional
} from '../models/professional';

@Component({
  selector: 'sh-available-professionals',
  templateUrl: './available-professionals.component.html',
  styleUrls: ['./available-professionals.component.css'],
  standalone: true,
  imports: [
    AsyncPipe
  ]
})
export class AvailableProfessionalsComponent {
  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly bookingState =
    inject(BookingState);

  private readonly professionalService =
    inject(ProviderProfessionalService);

  protected readonly selectedProfessionalId = computed(
    () => this.bookingState.summary().professionalId
  );

  protected readonly professionals$ = combineLatest([
    this.route.parent!.parent!.paramMap,
    this.route.parent!.paramMap
  ]).pipe(
    switchMap(([providerParams, serviceParams]) => {
      const providerId =
        providerParams.get('providerId');

      const serviceId =
        serviceParams.get('serviceId');

      if (!providerId) {
        throw new Error('providerId não informado');
      }

      if (!serviceId) {
        throw new Error('serviceId não informado');
      }

      return this.professionalService
        .getAvailableByProviderAndOffering(
          providerId,
          serviceId
        );
    }),

    tap(professionals => {
      const selectedId =
        this.bookingState.summary().professionalId;

      if (!selectedId) {
        this.bookingState.update({
          professionalName: 'Sem preferência'
        });

        return;
      }

      const selectedProfessional =
        professionals.find(
          professional =>
            professional.id === selectedId
        );

      this.bookingState.update({
        professionalName:
          selectedProfessional?.name ?? null
      });
    })
  );

  protected selectProfessional(
    professional: Professional
  ): void {
    this.bookingState.update({
      professionalId: professional.id,
      professionalName: professional.name,
      date: null,
      time: null
    });

    this.updateProfessionalQueryParam(
      professional.id
    );
  }

  protected selectNoPreference(): void {
    this.bookingState.update({
      professionalId: null,
      professionalName: 'Sem preferência',
      date: null,
      time: null
    });

    this.updateProfessionalQueryParam(null);
  }

  private updateProfessionalQueryParam(
    professionalId: string | null
  ): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        professionalId
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
