import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';

import { Professional } from '../models/professional';
import { PROFESSIONALS_MOCK } from './provider-professional.mock';

@Injectable({
  providedIn: 'root'
})
export class ProviderProfessionalService {
  getAvailableByProviderAndOffering(
    providerId: string,
    offeringId: string
  ): Observable<readonly Professional[]> {
    return of(PROFESSIONALS_MOCK).pipe(
      map(professionals =>
        professionals.filter(
          professional =>
            professional.providerId === providerId &&
            professional.offeringIds.includes(offeringId) &&
            professional.active
        )
      ),
      delay(300)
    );
  }

  getById(
    providerId: string,
    professionalId: string
  ): Observable<Professional | undefined> {
    return of(PROFESSIONALS_MOCK).pipe(
      map(professionals =>
        professionals.find(
          professional =>
            professional.providerId === providerId &&
            professional.id === professionalId &&
            professional.active
        )
      ),
      delay(300)
    );
  }
}
