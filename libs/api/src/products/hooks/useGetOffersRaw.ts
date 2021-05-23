import * as React from 'react';
import { ApiClientContext } from '../../core';
import { useRequest } from '../../shared/useRequest';
import {
  GetOffersByIdParams,
  GetOffersInfoItem,
  GetOffersParams,
  getOffersRaw,
} from '../requests/getOffers';

export const useGetOffersRaw = (
  params: GetOffersParams | GetOffersByIdParams
) => {
  const { client } = React.useContext(ApiClientContext);
  const { reqError, reqSuccess, load, state } = useRequest<
    GetOffersInfoItem[]
  >();

  React.useEffect(() => {
    getOfferReq();

    async function getOfferReq() {
      load();

      try {
        const offersData = await getOffersRaw(client, params);
        reqSuccess(offersData);
      } catch (error) {
        reqError(error);
      }
    }
  }, [params]);

  return state;
};
