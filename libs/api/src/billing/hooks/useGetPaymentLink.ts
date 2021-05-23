import * as React from 'react';
import { ApiClientContext } from '../../core';
import { useRequest } from '../../shared/useRequest';
import { InvoicePaymentLink } from '../models/invoice';
import { getPaymentLink } from '../requests/getPaymentLink';

export const useGetPaymentLink = (invoiceId: string, languageCode: string) => {
  const { client } = React.useContext(ApiClientContext);

  const {
    reqError,
    reqSuccess,
    load,
    state,
  } = useRequest<InvoicePaymentLink>();

  React.useEffect(() => {
    getPaymentLinkReq();

    async function getPaymentLinkReq() {
      load();

      try {
        const paymentData = await getPaymentLink(
          client,
          invoiceId,
          languageCode
        );

        reqSuccess(paymentData);
      } catch (error) {
        reqError(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};
