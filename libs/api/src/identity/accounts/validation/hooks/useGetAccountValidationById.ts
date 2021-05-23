import * as React from 'react';
import { ApiClientContext } from '../../../../core';
import { useRequest } from '../../../../shared/useRequest';
import {
  getAccountValidationWithValidationId,
  GetValidationsIdParams,
} from '../requests/getValidationById';
import { Validation } from '../models/validations';

export const useGetAccountValidationByValidationId = (
  params: GetValidationsIdParams
) => {
  const { client } = React.useContext(ApiClientContext);
  const { reqError, reqSuccess, load, state } = useRequest<Validation>();

  React.useEffect(() => {
    getAccountValidationByIdReq();

    async function getAccountValidationByIdReq() {
      load();
      try {
        const validationData = await getAccountValidationWithValidationId(
          client,
          params
        );
        reqSuccess(validationData);
      } catch (error) {
        reqError(error);
      }
    }
  }, []);

  return state;
};
