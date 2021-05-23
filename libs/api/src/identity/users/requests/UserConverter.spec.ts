import faker from 'faker';
import { UserConverter } from './UserConverter';

describe('UserConverter', () => {
  describe('convertIntoUser', () => {
    it('should convert partyID and accountId', () => {
      const testData = makeTestUserData().Resources[0];
      const userData = UserConverter.convert(testData);
      expect(userData.partyId).toEqual(testData.partyId);
      expect(userData.accountId).toEqual(testData.externalId);
    });

    it('should convert city, country and street', () => {
      const testData = makeTestUserData().Resources[0];
      const userData = UserConverter.convert(testData);
      expect(userData.city).toEqual(testData.addresses[0].locality);
      expect(userData.country).toEqual(testData.addresses[0].country);
      expect(userData.street).toEqual(testData.addresses[0].streetAddress);
    });

    it('should convert to empty string if city, country and street are undefined', () => {
      const testData = makeTestUserData().Resources[0];
      const testDataPrimaryAddress = testData.addresses.find(
        (primary) => primary
      );
      testDataPrimaryAddress.locality = undefined;
      testDataPrimaryAddress.country = undefined;
      testDataPrimaryAddress.streetAddress = undefined;
      const userData = UserConverter.convert(testData);
      expect(userData.city).toEqual('');
      expect(userData.country).toEqual('');
      expect(userData.street).toEqual('');
    });

    it('should convert name to first name and last name ', () => {
      const testData = makeTestUserData().Resources[0];
      const userData = UserConverter.convert(testData);
      expect(userData.firstName).toEqual(testData.name.givenName);
      expect(userData.lastName).toEqual(testData.name.familyName);
    });

    it('should convert to empty string if first name and last name are undefined', () => {
      const testData = makeTestUserData().Resources[0];
      testData.name.givenName = undefined;
      testData.name.familyName = undefined;
      const userData = UserConverter.convert(testData);
      expect(userData.firstName).toEqual('');
      expect(userData.lastName).toEqual('');
    });

    it('should convert the email field', () => {
      const testData = makeTestUserData().Resources[0];
      const userData = UserConverter.convert(testData);
      expect(userData.email).toEqual(testData.emails[0].value);
    });

    it('should convert the email to empty string if it is not provide', () => {
      const testData = makeTestUserData().Resources[0];
      const testDataPrimaryEmail = testData.emails.find((primary) => primary);
      testDataPrimaryEmail.value = undefined;
      const userData = UserConverter.convert(testData);
      expect(userData.email).toEqual('');
    });

    it('should convert the phoneNumber field', () => {
      const testData = makeTestUserData().Resources[0];
      const userData = UserConverter.convert(testData);
      expect(userData.phoneNumber).toEqual(testData.phoneNumbers[0].value);
    });

    it('should return an empty string phoneNumber field is undefined', () => {
      const testData = makeTestUserData().Resources[0];
      const testDataPrimaryPhoneNumber = testData.phoneNumbers.find(
        (primary) => primary
      );
      testDataPrimaryPhoneNumber.value = undefined;
      const userData = UserConverter.convert(testData);
      expect(userData.phoneNumber).toEqual('');
    });
  });
});

export function makeTestUserData() {
  return {
    Resources: [
      {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User' as const],
        id: faker.random.uuid(),
        externalId: faker.random.uuid(),
        userName: faker.internet.userName(),
        partyId: faker.random.uuid(),
        entitlements: [faker.lorem.text()],
        meta: {},
        name: {
          formatted: `${faker.name.firstName()} ${faker.name.lastName()}`,
          familyName: faker.name.firstName(),
          givenName: faker.name.lastName(),
          middleName: faker.name.middleName(),
          honorificPrefix: faker.name.prefix(),
          honorificSuffix: faker.name.suffix(),
        },
        phoneNumbers: [
          {
            value: faker.phone.phoneNumber(),
            type: 'other' as const,
            primary: true,
            display: faker.phone.phoneNumber(),
          },
        ],
        addresses: [
          {
            type: 'other' as const,
            streetAddress: faker.address.streetAddress(),
            locality: faker.address.streetName(),
            region: faker.address.state(),
            postalCode: faker.address.zipCode(),
            country: faker.address.country(),
            formatted: `${faker.address.streetAddress()} ${faker.address.streetAddress()}`,
            primary: true,
          },
        ],
        emails: [
          {
            value: faker.internet.email(),
            type: 'other' as const,
            primary: true,
          },
        ],
      },
    ],
  };
}
