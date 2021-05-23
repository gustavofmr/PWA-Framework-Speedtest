import { Validation } from '../models/validations';
import { PostValidationSuccessResponse } from './postValidation';
import { GetValidationsIdSuccessResponse } from './getValidationById';

export class ValidationConverter {
  public static convert(
    data: PostValidationSuccessResponse | GetValidationsIdSuccessResponse
  ): Validation {
    return {
      status: !!(data.status === 'true'),
      validationId: data?.id ?? '',
    };
  }
}
