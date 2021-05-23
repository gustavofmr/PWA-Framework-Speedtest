import faker from 'faker';
import { filterAndFormatOffers, formatOffer } from './formatOffer';
import { GetOffersInfoItem, GetOffersSuccessResponse } from './getOffers';

export const makeTestOfferItem = (): GetOffersInfoItem => ({
  plan: {
    download_speed: faker.random.number(),
    upload_speed: faker.random.number(),
    price: {
      value: faker.random.number(),
      type: 'PRICE_TYPE',
    },
    data_limit: faker.random.number(),
    name: `PLAN_NAME ${faker.random.number()}`,
  },
});

export const makeTestOffersData = (
  length: number = 2,
  makeItemCb: () => GetOffersInfoItem | any = makeTestOfferItem
): GetOffersSuccessResponse => ({
  id: faker.random.uuid(),
  items: [...Array(length)].map(() => makeItemCb()),
});

const isRawAndFormattedSame = (rawItem, _formattedValues) => {
  const {
    name,
    price,
    dataLimit: data_limit,
    downloadSpeed: download_speed,
  } = _formattedValues;

  const formattedValues = {
    name,
    price,
    data_limit,
    download_speed,
  };

  Object.keys(formattedValues).map((key) => {
    if (key !== 'price') {
      expect(rawItem?.plan?.[key]).toStrictEqual(formattedValues[key]);
    } else {
      expect(rawItem?.plan?.price.value).toStrictEqual(
        formattedValues.price.value
      );
      expect(rawItem?.plan?.price.type).toStrictEqual(
        formattedValues.price.currency
      );
    }
  });
};

describe('formatOffer', () => {
  test('formatted values are equal to their raw values', () => {
    const testItems = makeTestOffersData(10).items;
    const formattedItems = filterAndFormatOffers(testItems);

    testItems.map((testItem, i) => {
      const formattedItem = formattedItems[i];

      expect(formattedItem.name).toEqual(testItem.plan.name);

      expect(testItem.plan.price.value).toStrictEqual(
        formattedItem.price.value
      );
      expect(testItem.plan.price.type).toStrictEqual(
        formattedItem.price.currency
      );

      expect(formattedItem.dataLimit).toEqual(testItem.plan.data_limit);

      expect(formattedItem.downloadSpeed).toEqual(testItem.plan.download_speed);
      isRawAndFormattedSame(testItems[i], formattedItems[i]);
    });
  });

  test('Test missing (NULL) values cases', () => {
    const testNullItems = makeTestOffersData(4).items;

    // Set those items to null to check if those values are also preserved
    testNullItems[0].plan.name = null;
    testNullItems[1].plan.price.type = null;
    testNullItems[1].plan.price.value = null;
    testNullItems[2].plan.data_limit = null;
    testNullItems[3].plan.download_speed = null;

    const formattedNullItems = filterAndFormatOffers(testNullItems);

    testNullItems.map((_, index) => {
      isRawAndFormattedSame(testNullItems[index], formattedNullItems[index]);
    });
  });

  test('Test missing (Undefined) values cases', () => {
    const testUndefinedItems = makeTestOffersData(4).items;

    testUndefinedItems[0].plan.name = undefined;
    testUndefinedItems[1].plan.price.type = undefined;
    testUndefinedItems[1].plan.price.value = undefined;
    testUndefinedItems[2].plan.data_limit = undefined;
    testUndefinedItems[3].plan.download_speed = undefined;

    const formattedUndefinedItems = filterAndFormatOffers(testUndefinedItems);

    testUndefinedItems.map((_, index) => {
      isRawAndFormattedSame(
        testUndefinedItems[index],
        formattedUndefinedItems[index]
      );
    });
  });

  test('Test missing (deleted) values cases', () => {
    const testDeletedItems = makeTestOffersData(4).items;

    delete testDeletedItems[0].plan.name;
    delete testDeletedItems[1].plan.price.type;
    delete testDeletedItems[1].plan.price.value;
    delete testDeletedItems[2].plan.data_limit;
    delete testDeletedItems[3].plan.download_speed;

    const formattedDeletedItems = testDeletedItems.map((item) =>
      formatOffer(item)
    );

    testDeletedItems.map((_, index) => {
      isRawAndFormattedSame(
        testDeletedItems[index],
        formattedDeletedItems[index]
      );
    });
  });
});
