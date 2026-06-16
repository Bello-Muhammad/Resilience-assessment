const { CreatorCard } = require('@app/models');
const { ulid } = require('ulid');

const repository = {
  /**
   * Save a completely validated Creator Card configuration
   */
  async create(cardData) {
    // Inject generated ULID directly as Mongo's primary key structure
    const docData = {
      _id: ulid(),
      ...cardData
    };

    const card = new CreatorCard(docData);
    await card.save();

    return card.toObject(); // Converts _id to id instantly using schema transform rules
  },

  /**
   * Find an active card by its slug string
   */
  async findBySlug(slug) {
    const card = await CreatorCard.findOne({ slug });
    if (!card) return null;

    return card.toObject();
  },

  /**
   * Soft delete target card using slug and verified creator context
   */
  async deleteBySlug(slug, creatorReference) {
    const now = Date.now();

    // Find matching non-deleted card ensuring creator ownership matches perfectly
    const card = await CreatorCard.findOneAndDelete(
      { slug, creator_reference: creatorReference },
      { $set: { deleted: now, updated: now } },
      { new: true } // Returns the modified object state
    );

    if (!card) return null;
    return card.toObject();
  }
};

module.exports = repository;