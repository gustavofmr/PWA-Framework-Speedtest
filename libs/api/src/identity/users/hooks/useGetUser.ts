import * as React from 'react';
import { ApiClientContext } from '../../../core';
import { User } from '../models/user';
import { useGetUsers } from './useGetUsers';
import { State } from '../../../shared/useRequest';

export const useGetUser = () => {
  const { viasatId } = React.useContext(ApiClientContext);
  const viasatIdMemo = React.useMemo(
    () => ({ filter: `accountId eq ${viasatId}` }),
    [viasatId]
  );

  const state = useGetUsers(viasatIdMemo);

  return (state.data
    ? { ...state, data: state.data[0] }
    : state) as State<User>;
};
