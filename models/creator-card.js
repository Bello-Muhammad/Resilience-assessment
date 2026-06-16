const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');

const modelName = 'creator_cards';

/**
 * @typedef {Object} LinkItem
 * @property {String} title
 * @property {String} url
 */

/**
 * @typedef {Object} RateItem
 * @property {String} name
 * @property {String} description
 * @property {Number} amount
 */

/**
 * @typedef {Object} ServiceRates
 * @property {String} currency
 * @property {RateItem[]} rates
 */

/**
 * @typedef {Object} ModelSchema
 * @property {String} _id
 * @property {String} title
 * @property {String} description
 * @property {String} slug
 * @property {String} creator_reference
 * @property {LinkItem[]} links
 * @property {ServiceRates} service_rates
 * @property {String} status
 * @property {String} access_type
 * @property {String} access_code
 * @property {Number} created
 * @property {Number} updated
 */

const schemaConfig = {
  // Use the framework's strict ULID schema type
  _id: { type: SchemaTypes.ULID, required: true },
  title: { type: SchemaTypes.String, required: true },
  description: { type: SchemaTypes.String, default: '' },

  // Enforce index and uniqueness constraints for custom lookup
  slug: { type: SchemaTypes.String, required: true, unique: true, index: true },
  creator_reference: { type: SchemaTypes.String, required: true, index: true },

  // Nested links array structure
  links: [
    {
      title: { type: SchemaTypes.String, required: true },
      url: { type: SchemaTypes.String, required: true }
    }
  ],

  // Nested rate objects configuration
  service_rates: {
    currency: { type: SchemaTypes.String, enum: ['NGN', 'USD', 'GBP', 'GHS'] },
    rates: [
      {
        name: { type: SchemaTypes.String, required: true },
        description: { type: SchemaTypes.String, default: '' },
        amount: { type: SchemaTypes.Number, required: true }
      }
    ]
  },

  status: { type: SchemaTypes.String, enum: ['draft', 'published'], required: true, index: true },
  access_type: { type: SchemaTypes.String, enum: ['public', 'private'], default: 'public' },
  access_code: { type: SchemaTypes.String, default: null },

  created: { type: SchemaTypes.Number, required: true },
  updated: { type: SchemaTypes.Number, required: true },
};

// Pass transformation controls straight into options to handle deep sanitization
const modelSchema = new ModelSchema(schemaConfig, {
  collection: modelName,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      // 1. Map root identifier
      if (ret._id) {
        ret.id = ret._id;
        delete ret._id;
      }

      // 2. Clear out auto-generated _id fields from the links array
      if (Array.isArray(ret.links)) {
        ret.links.forEach(link => {
          if (link._id) delete link._id;
        });
      }

      // 3. Clear out auto-generated _id fields from the service rates array
      if (ret.service_rates && Array.isArray(ret.service_rates.rates)) {
        ret.service_rates.rates.forEach(rate => {
          if (rate._id) delete rate._id;
        });
      }

      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      // Replicate the identical cleaning strategy for app-internal casting calls
      if (ret._id) {
        ret.id = ret._id;
        delete ret._id;
      }

      if (Array.isArray(ret.links)) {
        ret.links.forEach(link => {
          if (link._id) delete link._id;
        });
      }

      if (ret.service_rates && Array.isArray(ret.service_rates.rates)) {
        ret.service_rates.rates.forEach(rate => {
          if (rate._id) delete rate._id;
        });
      }

      return ret;
    }
  }
});

/** @type {ModelSchema} */
module.exports = DatabaseModel.model(modelName, modelSchema);