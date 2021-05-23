import { Offer } from '../models/offer';
import { GetOffersInfoItem } from './getOffers';

export type ApiSpecResponseData = GetOffersInfoItem;

export const filterOffers = (
  data: GetOffersInfoItem[]
): ApiSpecResponseData[] =>
  data.filter((item: ApiSpecResponseData) => !!item?.plan);

export const formatOffer = (offer: ApiSpecResponseData): Offer => ({
  name: offer.plan?.name,
  price: {
    value: offer.plan?.price?.value,
    currency: offer.plan?.price?.type,
  },
  dataLimit: offer.plan?.data_limit,
  downloadSpeed: offer.plan?.download_speed,
});

export const filterAndFormatOffers = (data: GetOffersInfoItem[]): Offer[] =>
  filterOffers(data).map(formatOffer);
