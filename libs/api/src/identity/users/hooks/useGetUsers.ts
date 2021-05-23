import * as React from 'react';
import { ApiClientContext } from '../../../core';
import { useRequest } from '../../../shared/useRequest';
import { User } from '../models/user';
import { getUsers, GetUsersParams } from '../requests/getUsers';

export const useGetUsers = (params: GetUsersParams) => {
  const { client } = React.useContext(ApiClientContext);
  const { reqError, reqSuccess, load, state } = useRequest<User[]>();

  React.useEffect(() => {
    getUserReq();

    async function getUserReq() {
      load();

      try {
        const userData = await getUsers(client, params);
        reqSuccess(userData);
      } catch (error) {
        reqError(error);
      }
    }
  }, [params]);

  return state;
};
