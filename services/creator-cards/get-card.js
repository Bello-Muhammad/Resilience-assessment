const { throwAppError } = require('@app-core/errors');
const { CreatorCardMessages } = require('@app/messages');
const CardRepository = require('@app/repository/creator-cards');

async function getCard(serviceData, options = {}) {
  let response;

  try {
    const { slug, access_code } = serviceData;

    const card = await CardRepository.findBySlug(slug);

    // check if card exist
    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND.message, CreatorCardMessages.CARD_NOT_FOUND.code); // 404 handled by framework mapped to NF01
    }

    // check if card is Drafts
    if (card.status === 'draft') {
      throwAppError(CreatorCardMessages.CARD_IS_DRAFT.message, CreatorCardMessages.CARD_IS_DRAFT.code); 
    }

    // Private card Access Control
    if (card.access_type === 'private') {
      if (!access_code) {
        throwAppError(CreatorCardMessages.MISSING_PIN.message, CreatorCardMessages.MISSING_PIN.code);
      }
      if (card.access_code !== access_code) {
        throwAppError(CreatorCardMessages.INVALID_PIN.message, CreatorCardMessages.INVALID_PIN.code);
      }
    }

    // remove access code from returned data
    delete card.access_code;
    
    response = card;
  } catch (error) {
    throw error;
  }

  return response;
}

module.exports = getCard;