import dayjs from 'dayjs';
import faker from 'faker';
import { GetSubscriptionsInfoItem } from './getSubscriptions';
import { SubscriptionConverter } from './SubscriptionConverter';

describe('SubscriptionConverter', () => {
  it('Should convert name to planName', () => {
    const serviceData = makeTestSubscriptionData();
    const activeSubscriptionRaw = serviceData[0];
    const subscriptionData = SubscriptionConverter.convert(serviceData);

    expect(subscriptionData.planName).toEqual(activeSubscriptionRaw.name);
  });

  it('Should convert total_usage_mb to mbUsed', () => {
    const serviceData = makeTestSubscriptionData();
    const activeSubscriptionRaw = serviceData[0];
    const subscriptionData = SubscriptionConverter.convert(serviceData);

    expect(subscriptionData.mbUsed).toStrictEqual(
      activeSubscriptionRaw.network_subscription.usage.total_usage_mb
    );
  });

  it('Should convert gb_allocated to gbAllocated', () => {
    const serviceData = makeTestSubscriptionData();
    const activeSubscriptionRaw = serviceData[0];
    const subscriptionData = SubscriptionConverter.convert(serviceData);

    expect(subscriptionData.gbAllocated).toStrictEqual(
      Number(activeSubscriptionRaw.network_subscription.gb_allocated)
    );
  });

  it('Should convert renewal_date to planRenewDate', () => {
    const serviceData = makeTestSubscriptionData();
    const activeSubscriptionRaw = serviceData[0];
    const subscriptionData = SubscriptionConverter.convert(serviceData);

    expect(subscriptionData.planRenewDate.get('year')).toStrictEqual(
      dayjs(activeSubscriptionRaw.network_subscription.renewal_date).get('year')
    );

    expect(subscriptionData.planRenewDate.get('month')).toStrictEqual(
      dayjs(activeSubscriptionRaw.network_subscription.renewal_date).get(
        'month'
      )
    );

    expect(subscriptionData.planRenewDate.get('day')).toStrictEqual(
      dayjs(activeSubscriptionRaw.network_subscription.renewal_date).get('day')
    );
  });
});

function makeTestSubscriptionData(): GetSubscriptionsInfoItem[] {
  return [
    {
      account_id: faker.random.uuid(),
      billing_address: {
        country: faker.address.country(),
        formatted: faker.random.words(5),
        locality: faker.address.city(),
        postal_code: faker.address.zipCode(),
        region: faker.address.county(),
        street_address: faker.address.streetAddress(true),
      },
      id: faker.random.uuid(),
      name: faker.random.words(4),
      service_id: faker.random.uuid(),
      events: [],
      state: { code: 'ACTIVE', details: faker.lorem.sentence(7) },
      network_subscription: {
        gb_allocated: `${faker.random.number()}`,
        modem: {
          mac_address: faker.internet.mac('-'),
          state: {
            code: faker.random.word(),
            details: faker.lorem.sentence(7),
          },
        },
        renewal_date: `${faker.date.future()}`,
        usage: {
          total_usage_mb: faker.random.number({ min: 2048, max: 9216 }),
          upload_speed_mbps: faker.random.number({ min: 10, max: 50 }),
          download_speed_mbps: faker.random.number({ min: 10, max: 50 }),
          end_timestamp: `${faker.date.future()}`,
          start_timestamp: `${faker.date.future()}`,
        },
      },
    },
  ];
}
