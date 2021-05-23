import faker from 'faker';
import { ValidationConverter } from './ValidationConverter';

describe('ValidationConverter', () => {
  it('should convert status from string to boolean', () => {
    const testData = makeTestValidationData();
    const validationData = ValidationConverter.convert(testData);

    expect(typeof testData.status).toBe('string');
    expect(validationData.status).toEqual(
      testData.status === 'true' ? true : false
    );
  });

  it('should convert validationId', () => {
    const testData = makeTestValidationData();
    const validationData = ValidationConverter.convert(testData);

    expect(validationData.validationId).toEqual(testData.id);
  });

  it('should convert to empty string validationId is undefined', () => {
    const testData = makeTestValidationData();
    testData.id = undefined;
    const validationData = ValidationConverter.convert(testData);

    expect(validationData.status).toEqual(
      testData.status === 'true' ? true : false
    );
    expect(validationData.validationId).toEqual('');
  });
});

function makeTestValidationData() {
  return {
    status: faker.random.boolean().toString(),
    id: faker.random.uuid(),
  };
}
