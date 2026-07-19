import { Offering } from '../models/offering';

export const OFFERINGS_MOCK: readonly Offering[] = [
  {
    id: '1',
    providerId: '1',
    name: 'Corte de cabelo',
    description: 'Corte masculino ou feminino',
    durationMinutes: 45,
    price: 60,
    active: true
  },
  {
    id: '2',
    providerId: '1',
    name: 'Barba',
    description: 'Modelagem e acabamento',
    durationMinutes: 30,
    price: 35,
    active: true
  },
  {
    id: '3',
    providerId: '1',
    name: 'Corte de cabelo + Barba',
    description: 'Corte masculino com corte de barba',
    durationMinutes: 45,
    price: 65,
    active: true
  }
];
