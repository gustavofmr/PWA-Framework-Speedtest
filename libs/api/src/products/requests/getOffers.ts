import { Client } from '../../core';
import { httpFetch } from '../../shared/fetch';
import { generateUrl } from '../../shared/utils';
import { paths } from '../models/api';
import { Offer } from '../models/offer';
import { PRODUCTS_ENDPOINT } from './constants';
import { filterAndFormatOffers } from './formatOffer';

const PATH = '/offers';
const PATH_BY_ID = '/offers/{OfferId}';

type GetOffersOperation = paths[typeof PATH];
export type GetOffersRequestBody = GetOffersOperation['post']['requestBody']['content']['application/json'];
export type GetOffersParams = GetOffersRequestBody;
export type GetOffersSuccessResponse = GetOffersOperation['post']['responses'][200]['content']['application/json'];
export type GetOffersInfoItem = GetOffersSuccessResponse['items'][0];

type GetOffersByIdOperation = paths[typeof PATH_BY_ID];
export type GetOffersByIdParams = GetOffersByIdOperation['parameters']['path'];
export type GetOffersByIdSuccessResponse = GetOffersByIdOperation['get']['responses'][200]['content']['application/json'];
export type GetOffersByIdInfoItem = GetOffersByIdSuccessResponse['items'][0];

export const getOffersRawById = async (
  client: Client,
  params: GetOffersByIdParams
): Promise<GetOffersByIdInfoItem[]> => {
  const url = `${client.getApiUrl()}${PRODUCTS_ENDPOINT}${generateUrl(
    PATH_BY_ID,
    params
  )}`;

  const headers = client.getAuthorizationHeader();

  headers.append('Content-Type', 'application/json');

  const fetchResponse = await httpFetch<GetOffersByIdSuccessResponse>(url, {
    headers,
    method: 'GET',
  });

  return fetchResponse.items;
};

export const getOffersRawBasic = async (
  client: Client,
  params: GetOffersParams
): Promise<GetOffersInfoItem[]> => {
  const url = `${client.getApiUrl()}${PRODUCTS_ENDPOINT}${generateUrl(
    PATH,
    {}
  )}`;

  const headers = client.getAuthorizationHeader();

  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify(params);

  const fetchResponse = await httpFetch<GetOffersSuccessResponse>(url, {
    headers,
    method: 'POST',
    body,
  });

  return fetchResponse.items;
};

function isGetOffersByIdParams(
  params: GetOffersParams | GetOffersByIdParams
): params is GetOffersByIdParams {
  return !!('OfferId' in params);
}

export const getOffersRaw = async (
  client: Client,
  params: GetOffersParams | GetOffersByIdParams
): Promise<GetOffersInfoItem[]> => {
  const hasOfferId = isGetOffersByIdParams(params);

  return hasOfferId
    ? await getOffersRawById(client, params as GetOffersByIdParams)
    : await getOffersRawBasic(client, params as GetOffersParams);
};

export const getOffers = async (
  client: Client,
  params: GetOffersParams | GetOffersByIdParams
): Promise<Offer[]> => {
  const resources = await getOffersRaw(client, params);
  return filterAndFormatOffers(resources);
};
