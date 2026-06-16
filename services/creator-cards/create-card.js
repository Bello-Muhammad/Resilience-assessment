const { throwAppError } = require('@app-core/errors');
const validator = require('@app-core/validator');
const { CreatorCardMessages } = require('@app/messages');
const CardRepository = require('@app/repository/creator-cards');
const crypto = require('crypto');

// VSL Spec for Field-Level Validation
const spec = `root {
  title string<trim|minLength:3|maxLength:100>
  description? string<trim|maxLength:500>
  slug? string<trim|minLength:5|maxLength:50>
  creator_reference string<trim|length:20>
  links[]? {
    title string<trim|minLength:1|maxLength:100>
    url string<trim|maxLength:200>
  }
  service_rates? {
    currency string(NGN|USD|GBP|GHS)
    rates[] {
      name string<trim|minLength:3|maxLength:100>
      description? string<trim|maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<length:6>
}`;

const parsedSpec = validator.parse(spec);

async function createCard(serviceData, option = {}) {
  let response;

  //data validation
  const data = validator.validate(serviceData, parsedSpec);

  try {
    //enforcing access rules
    const accessType = data.access_type || 'public';

    if (accessType === 'private' && !data.access_code) {
      throwAppError(CreatorCardMessages.MISSING_ACCESS_CODE.message, CreatorCardMessages.MISSING_ACCESS_CODE.code);
    }

    if (accessType === 'public' && data.access_code) {
      throwAppError(CreatorCardMessages.PUBLIC_ACCESS_CODE_ERROR.message, CreatorCardMessages.PUBLIC_ACCESS_CODE_ERROR.code);
    }

    // 4. Slug Logic
    let finalSlug = data.slug;

    if (finalSlug) {
      const existing = await CardRepository.findBySlug(finalSlug);

      if (existing) throwAppError(CreatorCardMessages.SLUG_TAKEN.message, CreatorCardMessages.SLUG_TAKEN.code);
    
    } else {
      
      // Auto-generate
      let baseSlug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
      let isTaken = await CardRepository.findBySlug(baseSlug);

      if (baseSlug.length < 5 || isTaken) {
        const randomSuffix = crypto.randomBytes(3).toString('hex'); // 6 chars
        finalSlug = `${baseSlug}-${randomSuffix}`;
      } else {
        finalSlug = baseSlug;
      }
    }

    // 5. Build Document
    const now = Date.now();
    const newCard = {
      ...data,
      slug: finalSlug,
      access_type: accessType,
      access_code: accessType === 'private' ? data.access_code : null,
      created: now,
      updated: now,
      deleted: null
    };

    // 6. Save document
    const savedCard = await CardRepository.create(newCard);

    response = savedCard;
  } catch (error) {
    throw error;
  }

  return response;
}

module.exports = createCard;