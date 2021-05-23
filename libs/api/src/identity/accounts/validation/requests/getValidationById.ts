import { Client } from '../../../../core';
import { httpFetch } from '../../../../shared/fetch';
import { generateUrl } from '../../../../shared/utils';
import { paths } from '../models/api';
import { Validation } from '../models/validations';
import { ACCOUNTS_ENDPOINT } from '../../constants';
import { ValidationConverter } from './ValidationConverter';

const PATH = '/validations/{id}';

type GetValidationsIdOperations = paths[typeof PATH];
export type GetValidationsIdParams = GetValidationsIdOperations['parameters']['path'];
export type GetValidationsIdSuccessResponse = GetValidationsIdOperations['get']['responses']['200']['content']['application/json'];

export const getAccountValidationWithValidationId = async (
  client: Client,
  params: GetValidationsIdParams
): Promise<Validation> => {
  const url = `${client.getApiUrl()}${ACCOUNTS_ENDPOINT}${generateUrl(
    PATH,
    params
  )}`;

  const headers = client.getAuthorizationHeader();

  const fetchResponse = await httpFetch<GetValidationsIdSuccessResponse>(url, {
    headers,
  });

  return ValidationConverter.convert(fetchResponse);
};
