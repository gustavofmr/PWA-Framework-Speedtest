import * as React from 'react';
import { ApiClientContext } from '../../core';
import { useRequest } from '../../shared/useRequest';
import { Subscription } from '../models/subscription';
import {
  getSubscriptions,
  GetSubscriptionsParams,
} from '../requests/getSubscriptions';

export const useGetSubscriptions = (params?: GetSubscriptionsParams) => {
  const { client } = React.useContext(ApiClientContext);
  const { reqError, reqSuccess, load, state } = useRequest<Subscription>();

  React.useEffect(() => {
    getSubscriptionReq();

    async function getSubscriptionReq() {
      if (params?.party_id) {
        load();

        try {
          const subscriptionsData = await getSubscriptions(client, params);
          reqSuccess(subscriptionsData);
        } catch (error) {
          reqError(error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.mac_address, params?.party_id, params?.state]);

  return state;
};
