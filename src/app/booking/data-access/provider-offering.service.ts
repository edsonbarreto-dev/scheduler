import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';

import { Offering } from '../models/offering';
import { OFFERINGS_MOCK } from './provider-offering.mock';

@Injectable()
export class ProviderOfferingService {
  getAvailableByProvider(
    providerId: string
  ): Observable<readonly Offering[]> {
    return of(OFFERINGS_MOCK).pipe(
      map(offerings =>
        offerings.filter(
          offering =>
            offering.providerId === providerId &&
            offering.active
        )
      ),
      delay(300)
    );
  }

  getById(
    providerId: string,
    serviceId: string
  ): Observable<Offering | undefined> {
    return of(OFFERINGS_MOCK).pipe(
      map(offerings =>
        offerings.find(
          offering =>
            offering.providerId === providerId &&
            offering.id === serviceId &&
            offering.active
        )
      ),
      delay(300)
    );
  }
}
