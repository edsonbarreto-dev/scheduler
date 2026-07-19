export interface Offering {
  id: string;
  providerId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}
