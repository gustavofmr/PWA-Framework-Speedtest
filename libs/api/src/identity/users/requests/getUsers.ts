import { Client } from '../../../core';
import { httpFetch } from '../../../shared/fetch';
import { generateUrl } from '../../../shared/utils';
import { IDENTITY_ENDPOINT } from '../../constants';
import { paths } from '../../models/api';
import { User } from '../models/user';
import { UserConverter } from './UserConverter';

const PATH = '/users';

type GetUserOperation = paths[typeof PATH];
export type GetUsersParams = GetUserOperation['get']['parameters']['query'];
export type GetUserSuccessResponse = GetUserOperation['get']['responses'][200]['content']['application/json'];
// TODO: Check if api schema should be updated with partyId
export type GetUserInfoItem = GetUserSuccessResponse['Resources'][0] & {
  partyId: string;
};

export const getUsers = async (
  client: Client,
  params: GetUsersParams = {}
): Promise<User[]> => {
  const fetchResponse = await getUsersRaw(client, params);
  return fetchResponse.map(UserConverter.convert);
};

export const getUsersRaw = async (
  client: Client,
  params: GetUsersParams = {}
): Promise<GetUserInfoItem[]> => {
  const url = `${client.getApiUrl()}${IDENTITY_ENDPOINT}${generateUrl(
    PATH,
    params
  )}`;

  const headers = client.getAuthorizationHeader();

  const fetchResponse = await httpFetch<GetUserSuccessResponse>(url, {
    headers,
  });
  // TODO: Check if api schema should be updated with partyId
  return fetchResponse.Resources as GetUserInfoItem[];
};
