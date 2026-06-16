const { createHandler } = require('@app-core/server');
const { DeleteCard } = require('@app/services');
const {CreatorCardMessages} = require('@app/messages');

module.exports = createHandler({
    path: '/creator-cards/:slug',
    method: 'delete',
    middlewares: [],

    async handler(rc, helper) {
        const payload = {
            ...rc.params,
            ...rc.body
        };

        const result = await DeleteCard(payload);

        return {
            status: helper.http_statuses.HTTP_200_OK,
            message: CreatorCardMessages.DELETE_SUCCESS,
            data: result
        }
    }
})