import * as React from 'react';
import { ApiClientContext } from '../../../../core';
import { useRequest } from '../../../../shared/useRequest';
import {
  postAccountValidation,
  PostValidationBody,
} from '../requests/postValidation';
import { Validation } from '../models/validations';

export const usePostAccountValidation = (body: PostValidationBody) => {
  const { client } = React.useContext(ApiClientContext);
  const { reqError, reqSuccess, load, state } = useRequest<Validation>();

  React.useEffect(() => {
    postAccountValidationReq();

    async function postAccountValidationReq() {
      load();

      try {
        const validationData = await postAccountValidation(client, body);
        reqSuccess(validationData);
      } catch (error) {
        reqError(error);
      }
    }
  }, []);

  return state;
};
