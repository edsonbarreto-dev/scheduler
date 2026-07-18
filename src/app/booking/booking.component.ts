import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {BookingState} from './booking-state';

@Component({
  selector: 'sh-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone: true,
  imports: [
    RouterOutlet
  ],
  providers: [
    BookingState
  ],
})
export class BookingComponent {

  protected readonly bookingState = inject(BookingState);

  protected confirmBooking() {

  }
}
