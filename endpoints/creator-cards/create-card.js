const { createHandler } = require('@app-core/server');
const { CreateCard } = require('@app/services');
const { CreatorCardMessages } = require('@app/messages');

module.exports = createHandler({
  path: '/creator-cards', // Root path, no /v1/
  method: 'post',
  middlewares: [], // NO AUTH MIDDLEWARES ALLOWED per instructions

  async handler(rc, helpers) {
    const payload = {
      ...rc.body
    };

    const result = await CreateCard(payload);

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: CreatorCardMessages.CREATE_SUCCESS,
      data: result,
    };
  },
});