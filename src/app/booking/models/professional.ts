export interface Professional {
  id: string;
  providerId: string;
  name: string;
  role: string;
  offeringIds: readonly string[];
  active: boolean;
}
