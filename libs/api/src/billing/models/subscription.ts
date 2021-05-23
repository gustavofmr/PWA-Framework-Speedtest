import dayjs from 'dayjs';

export interface Subscription {
  mbUsed: number;
  planName: string;
  gbAllocated: number;
  planRenewDate: dayjs.Dayjs;
}
