import { Client } from '../../core';
import { httpFetch } from '../../shared/fetch';
import { generateUrl } from '../../shared/utils';
import { paths } from '../models/api';
import { Subscription } from '../models/subscription';
import { BILLING_ENDPOINT } from './constants';
import { SubscriptionConverter } from './SubscriptionConverter';

const PATH = '/subscriptions';

type GetSubscriptionsOperation = paths[typeof PATH];
export type GetSubscriptionsParams = GetSubscriptionsOperation['get']['parameters']['query'];
export type GetSubscriptionsSuccessResponse = GetSubscriptionsOperation['get']['responses'][200]['content']['application/json'];
export type GetSubscriptionsInfoItemCurrent = NonNullable<
  GetSubscriptionsSuccessResponse['items']
>[0];
export type GetSubscriptionsInfoItem = GetSubscriptionsInfoItemCurrent;

export const getSubscriptionsRaw = async (
  client: Client,
  params: GetSubscriptionsParams = {}
): Promise<GetSubscriptionsInfoItem[]> => {
  const url = `${client.getApiUrl()}${BILLING_ENDPOINT}${generateUrl(
    PATH,
    params
  )}`;

  const headers = client.getAuthorizationHeader();

  const fetchResponse = await httpFetch<GetSubscriptionsSuccessResponse>(url, {
    headers,
  });

  return fetchResponse.items ?? [];
};

export const getSubscriptions = async (
  client: Client,
  params: GetSubscriptionsParams = {}
): Promise<Subscription> => {
  const resources = (await getSubscriptionsRaw(client, params)) || [];

  return SubscriptionConverter.convert(resources);
};
