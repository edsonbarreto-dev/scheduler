import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';

import { ProviderProfile } from '../models/provider-profile';
import { PROVIDERS_MOCK } from './provider-profile.mock';

@Injectable({
  providedIn: 'root'
})
export class ProviderProfileService {
  getById(
    providerId: string
  ): Observable<ProviderProfile | undefined> {
    return of(PROVIDERS_MOCK).pipe(
      map(providers =>
        providers.find(
          provider =>
            provider.id === providerId &&
            provider.active
        )
      ),
      delay(300)
    );
  }
}
