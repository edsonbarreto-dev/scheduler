import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { AvailableDate } from '../models/available-date';
import { AvailableTime } from '../models/available-time';
import { OFFERINGS_MOCK } from './provider-offering.mock';

@Injectable({
  providedIn: 'root'
})
export class ProviderAvailableService {
  getAvailableDates(
    providerId: string,
    offeringId: string,
    professionalId: string | null
  ): Observable<readonly AvailableDate[]> {
    const dates = this.buildDates(
      providerId,
      offeringId,
      professionalId
    );

    return of(dates).pipe(
      delay(300)
    );
  }

  getAvailableTimes(
    providerId: string,
    offeringId: string,
    date: string,
    professionalId: string | null
  ): Observable<readonly AvailableTime[]> {
    const offering = OFFERINGS_MOCK.find(
      item =>
        item.providerId === providerId &&
        item.id === offeringId &&
        item.active
    );

    if (!offering) {
      return of([]).pipe(
        delay(300)
      );
    }

    const times = this.buildTimes(
      offering.durationMinutes,
      `${providerId}:${offeringId}:${date}:${professionalId ?? 'any'}`,
      professionalId
    );

    return of(times).pipe(
      delay(300)
    );
  }

  private buildDates(
    providerId: string,
    offeringId: string,
    professionalId: string | null
  ): readonly AvailableDate[] {
    const dates: AvailableDate[] = [];

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const seed = this.createSeed(
      `${providerId}:${offeringId}:${professionalId ?? 'any'}`
    );

    const professionalDayOff = professionalId
      ? (seed % 6) + 1
      : null;

    for (
      let offset = 1;
      dates.length < 8 && offset <= 21;
      offset++
    ) {
      const candidate = new Date(today);

      candidate.setDate(
        today.getDate() + offset
      );

      const weekday = candidate.getDay();

      const isSunday =
        weekday === 0;

      const isProfessionalDayOff =
        professionalDayOff === weekday;

      if (
        isSunday ||
        isProfessionalDayOff
      ) {
        continue;
      }

      dates.push({
        date: this.toIsoDate(candidate)
      });
    }

    return dates;
  }

  private buildTimes(
    durationMinutes: number,
    seedValue: string,
    professionalId: string | null
  ): readonly AvailableTime[] {
    const times: AvailableTime[] = [];

    const openingTime = 9 * 60;
    const closingTime = 18 * 60;

    const lunchStart = 12 * 60;
    const lunchEnd = 13 * 60;

    const slotInterval = 30;
    const seed = this.createSeed(seedValue);

    for (
      let start = openingTime;
      start + durationMinutes <= closingTime;
      start += slotInterval
    ) {
      const end =
        start + durationMinutes;

      const overlapsLunch =
        start < lunchEnd &&
        end > lunchStart;

      if (overlapsLunch) {
        continue;
      }

      const slotIndex =
        (start - openingTime) /
        slotInterval;

      const unavailableModulo =
        professionalId ? 4 : 7;

      const isUnavailable =
        (slotIndex + seed) %
        unavailableModulo ===
        0;

      if (isUnavailable) {
        continue;
      }

      times.push({
        start: this.minutesToTime(start),
        end: this.minutesToTime(end)
      });
    }

    return times;
  }

  private minutesToTime(
    totalMinutes: number
  ): string {
    const hours = Math.floor(
      totalMinutes / 60
    );

    const minutes =
      totalMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}`;
  }

  private toIsoDate(
    date: Date
  ): string {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private createSeed(
    value: string
  ): number {
    return [...value].reduce(
      (total, character) =>
        total +
        character.charCodeAt(0),
      0
    );
  }
}
