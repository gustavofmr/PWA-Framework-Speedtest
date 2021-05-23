import { Money } from '@vst/api/billing';
export interface Offer {
  name?: string;
  price?: Partial<Money>;
  dataLimit?: number;
  downloadSpeed?: number;
}
