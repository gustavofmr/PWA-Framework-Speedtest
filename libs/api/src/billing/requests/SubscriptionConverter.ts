import dayjs from 'dayjs';
import { Subscription } from '../models/subscription';
import { GetSubscriptionsInfoItem } from './getSubscriptions';

export type ApiSpecResponseData = GetSubscriptionsInfoItem[];

enum SubscriptionStateCodes {
  ACTIVE = 'ACTIVE',
}

export class SubscriptionConverter {
  public static convert(data: ApiSpecResponseData): Subscription {
    const activeSubscription = filterActiveSubscriptions(data);

    const { name: planName, network_subscription } = activeSubscription ?? {};
    const gbAllocated = Number(network_subscription?.gb_allocated);

    return {
      planName: planName ?? '',
      mbUsed: network_subscription?.usage?.total_usage_mb ?? 0,
      gbAllocated: Number.isNaN(gbAllocated) ? 0 : gbAllocated,
      planRenewDate: dayjs(network_subscription?.renewal_date) ?? dayjs(),
    };
  }
}

function filterActiveSubscriptions(
  data: ApiSpecResponseData
): GetSubscriptionsInfoItem {
  const filtered = data.filter(keepOnlyActiveSubscription);

  return filtered[0];

  function keepOnlyActiveSubscription(subscription: GetSubscriptionsInfoItem) {
    const {
      name,
      state: { code },
      network_subscription,
    } = subscription;

    const hasName = !!name;
    const hasNetworkSubscription = !!network_subscription;
    const isActive = code === SubscriptionStateCodes.ACTIVE;

    return isActive && hasNetworkSubscription && hasName;
  }
}
