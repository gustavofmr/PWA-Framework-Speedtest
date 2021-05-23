import * as React from 'react';
import { ApiClientContext } from '../../core';
import { useRequest } from '../../shared/useRequest';
import { Offer } from '../models/offer';
import {
  getOffers,
  GetOffersByIdParams,
  GetOffersParams,
} from '../requests/getOffers';

export const useGetOffers = (params: GetOffersParams | GetOffersByIdParams) => {
  const { client } = React.useContext(ApiClientContext);
  const { reqError, reqSuccess, load, state } = useRequest<Offer[]>();

  React.useEffect(() => {
    getOfferReq();

    async function getOfferReq() {
      load();

      try {
        const offersData = await getOffers(client, params);
        reqSuccess(offersData);
      } catch (error) {
        reqError(error);
      }
    }
  }, [params]);

  return state;
};
