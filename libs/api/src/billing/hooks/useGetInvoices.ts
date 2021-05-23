import * as React from 'react';
import { ApiClientContext } from '../../core/context';
import { useRequest } from '../../shared/useRequest';
import { Invoice } from '../models/invoice';
import { getInvoices } from '../requests/getInvoices';

export const useGetInvoices = () => {
  const { client, viasatId } = React.useContext(ApiClientContext);

  const { reqError, reqSuccess, load, state } = useRequest<Invoice[]>();

  React.useEffect(() => {
    if (viasatId) {
      getInvoicesReq();
    }

    async function getInvoicesReq() {
      load();

      try {
        const invoicesData = await getInvoices(client, {
          account_id: viasatId,
        });

        reqSuccess(invoicesData);
      } catch (error) {
        reqError(error);
      }
    }
  }, [viasatId]);

  return state;
};
