import * as React from 'react';
import { ApiClientContext } from '../../../core';
import { useRequest } from '../../../shared/useRequest';
import {
  getUsersRaw,
  GetUsersParams,
  GetUserInfoItem,
} from '../requests/getUsers';

export const useGetUsersRaw = (params: GetUsersParams) => {
  const { client } = React.useContext(ApiClientContext);
  const { reqError, reqSuccess, load, state } = useRequest<GetUserInfoItem[]>();

  React.useEffect(() => {
    getUserReq();

    async function getUserReq() {
      load();

      try {
        const userData = await getUsersRaw(client, params);
        reqSuccess(userData);
      } catch (error) {
        reqError(error);
      }
    }
  }, []);

  return state;
};
