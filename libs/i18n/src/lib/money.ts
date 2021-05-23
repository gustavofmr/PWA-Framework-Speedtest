import { Money } from '@vst/api/billing';

export const formatMoney = ({ value, currency }: Money) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(value / 100);
