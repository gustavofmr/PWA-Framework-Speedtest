import faker from 'faker';
import { GetSubscriptionsInfoItem } from './getSubscriptions';

export const makeTestSubscriptionDataObject = (): GetSubscriptionsInfoItem => {
  const start_timestamp = faker.random.number();
  const testState = {
    code: 'ACTIVE',
    details: 'testDetails',
  };

  return {
    name: 'PLAN_NAME_PLACEHOLDER',
    id: faker.random.uuid(),
    account_id: faker.random.uuid(),
    service_id: faker.random.uuid(),
    billing_address: {
      streetAddress: faker.address.streetAddress(),
      locality: faker.address.streetName(),
      region: faker.address.state(),
      postalCode: faker.address.zipCode(),
      country: faker.address.country(),
      formatted: `${faker.address.streetAddress()} ${faker.address.zipCode()}`,
    },
    state: testState,
    events: [
      {
        type: ['activation', 'deactivation'][faker.random.number(1)],
        timestamp: faker.random.number(),
      },
    ],
    network_subscription: {
      usage: {
        download_speed_mbps: faker.random.number(),
        upload_speed_mbps: faker.random.number(),
        total_usage_mb: faker.random.number(),
        start_timestamp: `${start_timestamp}`,
        end_timestamp: `${start_timestamp + faker.random.number()}`,
      },
      modem: {
        mac_address: faker.internet.mac(),
        state: testState,
      },
      renewal_date: `${faker.date.future()}`,
      gb_allocated: `${faker.random.number()}`,
    },
  };
};
