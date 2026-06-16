module.exports = {
  SLUG_TAKEN: { message: 'Slug is already taken', code: 'SL02' },
  MISSING_ACCESS_CODE: { message: 'access_code is required when access_type is private', code: 'AC01' },
  PUBLIC_ACCESS_CODE_ERROR: { message: 'access_code can only be set on private cards', code: 'AC05' },
  CARD_NOT_FOUND: { message: 'Creator card not found', code: 'NF01' },
  CARD_IS_DRAFT: { message: 'Card is a draft', code: 'NF02' },
  MISSING_PIN: { message: 'Private card requires an access code', code: 'AC03' },
  INVALID_PIN: { message: 'Invalid access code', code: 'AC04' },
  CREATE_SUCCESS: 'Creator Card Created Successfully.',
  GET_SUCCESS: 'Creator Card Retrieved Successfully.',
  DELETE_SUCCESS: 'Creator Card Deleted Successfully.'
};

// module.exports = CreatorCardMessages;