import {DestroyRef, inject, Injectable, signal} from '@angular/core';

import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

import {distinctUntilChanged, filter, forkJoin, map, of, startWith, switchMap, tap} from 'rxjs';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {ProviderProfileService} from './data-access/provider-profile.service';

import {BookingState} from './booking-state';

import {ProviderOfferingService} from './data-access/provider-offering.service';

export interface BookingRouteContext {
  providerId: string | null;
  serviceId: string | null;
  professionalId: string | null;
  date: string | null;
  time: string | null;
}

const EMPTY_CONTEXT: BookingRouteContext = {
  providerId: null, serviceId: null, professionalId: null, date: null, time: null
};

@Injectable()
export class BookingStateHydrator {
  private readonly router = inject(Router);

  private readonly bookingState = inject(BookingState);

  private readonly offeringService = inject(ProviderOfferingService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly _context = signal<BookingRouteContext>(EMPTY_CONTEXT);

  private readonly providerService = inject(ProviderProfileService);

  private started = false;

  readonly context = this._context.asReadonly();

  start(): void {
    if (this.started) {
      return;
    }

    this.started = true;

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd),

      startWith(null),

      map(() => this.readRouteContext()),

      distinctUntilChanged((previous, current) => previous.providerId === current.providerId && previous.serviceId === current.serviceId && previous.professionalId === current.professionalId && previous.date === current.date && previous.time === current.time),

      tap(context => {
        this._context.set(context);

        this.applyRouteContext(context);
      }),

      switchMap(context => {
        const provider$ = context.providerId ? this.providerService.getById(context.providerId) : of(undefined);

        const offering$ = context.providerId && context.serviceId ? this.offeringService.getById(context.providerId, context.serviceId) : of(undefined);

        return forkJoin({
          provider: provider$, offering: offering$
        });
      }),

      takeUntilDestroyed(this.destroyRef)).subscribe(({provider, offering}) => {
      this.bookingState.update({
        providerName: provider?.name ?? null,

        serviceName: offering?.name ?? null
      });
    });
  }

  private applyRouteContext(context: BookingRouteContext): void {
    const current = this.bookingState.summary();

    const serviceChanged = current.serviceId !== context.serviceId;

    const professionalChanged = current.professionalId !== context.professionalId;

    const providerChanged = current.providerId !== context.providerId;

    this.bookingState.update({
      providerId: context.providerId,

      serviceId: context.serviceId,

      professionalId: context.professionalId,

      providerName: providerChanged ? null : current.providerName,

      date: context.date,

      time: context.time,

      serviceName: serviceChanged ? null : current.serviceName,

      professionalName: professionalChanged ? null : current.professionalName
    });
  }

  private readRouteContext(): BookingRouteContext {
    const params: Record<string, string> = {};

    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;

    while (route) {
      Object.assign(params, route.params);

      route = route.firstChild;
    }

    const queryParams = this.router.routerState.snapshot.root.queryParamMap;

    return {
      providerId: params['providerId'] ?? null,

      serviceId: params['serviceId'] ?? queryParams.get('serviceId'),

      professionalId: queryParams.get('professionalId'),

      date: params['date'] ?? queryParams.get('date'),

      time: queryParams.get('time')
    };
  }
}
