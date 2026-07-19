import { Professional } from '../models/professional';

export const PROFESSIONALS_MOCK: readonly Professional[] = [
  {
    id: '1',
    providerId: '1',
    name: 'Marina Costa',
    role: 'Cabeleireira',
    offeringIds: ['1', '3'],
    active: true
  },
  {
    id: '2',
    providerId: '1',
    name: 'Lucas Almeida',
    role: 'Barbeiro',
    offeringIds: ['1', '2', '3'],
    active: true
  },
  {
    id: '3',
    providerId: '1',
    name: 'Rafael Santos',
    role: 'Barbeiro',
    offeringIds: ['2', '3'],
    active: true
  },
  {
    id: '4',
    providerId: '1',
    name: 'Camila Rocha',
    role: 'Cabeleireira',
    offeringIds: ['1'],
    active: false
  }
];
