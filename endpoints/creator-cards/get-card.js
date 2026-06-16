const { createHandler } = require('@app-core/server');
const { GetCard } = require('@app/services');
const {CreatorCardMessages} = require('@app/messages');

module.exports = createHandler({
    path: '/creator-cards/:slug',
    method: 'get',
    middlewares: [],

    async handler(rc, helper) {
        const payload = {
            ...rc.params,
            ...rc.query
        };

        const result = await GetCard(payload);

        return {
            status: helper.http_statuses.HTTP_200_OK,
            message: CreatorCardMessages.GET_SUCCESS,
            data: result
        }
    }
})