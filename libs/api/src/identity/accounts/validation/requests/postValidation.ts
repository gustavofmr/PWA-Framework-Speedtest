import { Client } from '../../../../core';
import { httpFetch } from '../../../../shared/fetch';
import { generateUrl } from '../../../../shared/utils';
import { paths } from '../models/api';
import { Validation } from '../models/validations';
import { ACCOUNTS_ENDPOINT } from '../../constants';
import { ValidationConverter } from './ValidationConverter';

const PATH = '/validations';

type PostValidationsOperation = paths[typeof PATH];
export type PostValidationBody = PostValidationsOperation['post']['requestBody']['content']['application/json'];
export type PostValidationSuccessResponse = PostValidationsOperation['post']['responses'][201]['content']['application/json'];

export const postAccountValidation = async (
  client: Client,
  body: PostValidationBody = {}
): Promise<Validation> => {
  const url = `${client.getApiUrl()}${ACCOUNTS_ENDPOINT}${generateUrl(
    PATH,
    {}
  )}`;

  const headers = {
    ...client.getAuthorizationHeader(),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const fetchResponse = await httpFetch<PostValidationSuccessResponse>(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  });

  return ValidationConverter.convert(fetchResponse);
};
