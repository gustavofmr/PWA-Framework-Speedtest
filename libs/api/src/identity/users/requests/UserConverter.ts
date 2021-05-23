import { User } from '../models/user';
import { GetUserInfoItem } from './getUsers';

const getMainAddress = (addresses: ApiSpecResponseData['addresses']) => {
  if (addresses && addresses[0]) {
    return addresses?.find(({ primary }) => primary) ?? addresses[0];
  } else {
    return null;
  }
};

export type ApiSpecResponseData = GetUserInfoItem;

export class UserConverter {
  public static convert(data: ApiSpecResponseData): User {
    const mainAddress = getMainAddress(data.addresses);
    const mainEmail = data.emails?.find(({ primary }) => primary);
    const mainPhoneNumber =
      data.phoneNumbers?.find(({ primary }) => primary) ||
      data.phoneNumbers?.shift();

    return {
      // TODO: Make sure to get the spec updated with partyId being part of user response
      partyId: data.partyId,
      accountId: data.externalId,
      city: mainAddress?.locality ?? '',
      country: mainAddress?.country ?? '',
      firstName: data.name?.givenName ?? '',
      lastName: data.name?.familyName ?? '',
      street: mainAddress?.streetAddress ?? '',
      phoneNumber: mainPhoneNumber?.value ?? '',
      email: mainEmail?.value ?? '',
    };
  }
}
