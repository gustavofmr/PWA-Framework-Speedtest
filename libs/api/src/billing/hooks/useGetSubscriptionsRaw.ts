import * as React from 'react';
import { ApiClientContext } from '../../core';
import { useRequest } from '../../shared/useRequest';
import {
  GetSubscriptionsInfoItem,
  GetSubscriptionsParams,
  getSubscriptionsRaw,
} from '../requests/getSubscriptions';

export const useGetSubscriptionsRaw = (params?: GetSubscriptionsParams) => {
  const { client } = React.useContext(ApiClientContext);
  const { reqError, reqSuccess, load, state } = useRequest<
    GetSubscriptionsInfoItem[]
  >();

  React.useEffect(() => {
    getSubscriptionReq();

    async function getSubscriptionReq() {
      load();

      try {
        const subscriptionsData = await getSubscriptionsRaw(client, params);
        reqSuccess(subscriptionsData);
      } catch (error) {
        reqError(error);
      }
    }
  }, [params]);

  return state;
};
