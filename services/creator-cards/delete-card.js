const validator = require('@app-core/validator');
const { throwAppError } = require('@app-core/errors');
const { CreatorCardMessages } = require('@app/messages');
const CardRepository = require('@app/repository/creator-cards');

// VSL Spec for Field-Level Validation
const spec = `root {
  creator_reference string<trim|length:20>
}`;

const parsedSpec = validator.parse(spec);

async function deleteCard(serviceData, options = {}) {
    let response;
    await validator.validate(serviceData, parsedSpec);

    try {

        const { slug, creator_reference } = serviceData;
        const card = await CardRepository.findBySlug(slug);

        // check if card exist
        if (!card) {
            throwAppError(CreatorCardMessages.CARD_NOT_FOUND.message, CreatorCardMessages.CARD_NOT_FOUND.code); // 404 handled by framework mapped to NF01
        }

        if (creator_reference !== card.creator_reference) {
            throwAppError(CreatorCardMessages.CARD_NOT_FOUND.message, CreatorCardMessages.CARD_NOT_FOUND.code); // 404 handled by framework mapped to NF01   
        }

        const deletedCard = await CardRepository.deleteBySlug(slug, creator_reference);

        // remove access code from returned data
        delete deletedCard.access_code;

        response = deletedCard;
    } catch (error) {
        throw error;
    }

    return response;
}

module.exports = deleteCard;