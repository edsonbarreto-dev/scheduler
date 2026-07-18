import { Injectable, signal } from '@angular/core';

export interface BookingSummary {
  providerName: string | null;
  serviceName: string | null;
  professionalName: string | null;
  date: string | null;
  time: string | null;
}

@Injectable()
export class BookingState {
  private readonly _summary = signal<BookingSummary>({
    providerName: null,
    serviceName: null,
    professionalName: null,
    date: null,
    time: null
  });

  readonly summary = this._summary.asReadonly();

  update(values: Partial<BookingSummary>): void {
    this._summary.update(current => ({
      ...current,
      ...values
    }));
  }
}
