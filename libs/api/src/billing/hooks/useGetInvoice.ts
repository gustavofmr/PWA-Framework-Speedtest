import * as React from 'react';
import { ApiClientContext } from '../../core';
import { useRequest } from '../../shared/useRequest';
import { Invoice } from '../models/invoice';
import { getInvoice, GetInvoiceParameters } from '../requests/getInvoice';

export const useGetInvoice = (params: GetInvoiceParameters) => {
  const { client } = React.useContext(ApiClientContext);

  const { reqError, reqSuccess, load, state } = useRequest<Invoice>();

  React.useEffect(() => {
    getInvoiceReq();

    async function getInvoiceReq() {
      load();

      try {
        const invoiceData = await getInvoice(client, params);

        reqSuccess(invoiceData);
      } catch (error) {
        reqError(error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};
