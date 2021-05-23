import { GetSubscriptionsParams } from '../requests/getSubscriptions';
import { useGetSubscriptions } from './useGetSubscriptions';

export const useGetSubscription = (params: GetSubscriptionsParams) => {
  const state = useGetSubscriptions(params);

  return state;
};
