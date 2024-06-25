const CircuitBreaker = require('opossum');
const Http = require('../utils/http');
const redis = require('../utils/redis');

class CommentsService {
    #client;
    #cbGetComments;

    constructor () {
        this.#client = new Http('http://localhost:3002');
        this.#cbGetComments = new CircuitBreaker(async (postId, limit = 5) => {
            const comments = [];

            const key = `comments:${id}:limit-${limit}`;
            const dataFromCache = await redis.get(key);
            if (dataFromCache) return JSON.parse(dataFromCache);

            const data = await this.#client.request({
                method: 'GET',
                path: '/comments',
                query: { postId }
            }, { timeout: 2000 });

            for (const comment of data) {
                if (comments.length >= limit) continue;

                comments.push({
                    id: comment.id,
                    text: comment.text,
                    userId: comment.userId
                })
            }

            await redis.set(key, JSON.stringify(comments), 'EX', 60);
            return comments;
        }, {
            errorThresholdPercentage: 10,
            resetTimeout: 10000,
            timeout: 1000
        });
        this.#cbGetComments.fallback(() => []);
    }

    /**
     * 
     * @param {number} postId 
     * @param {number} limit 
     */
    async getComments (postId, limit = 5) {
        return this.#cbGetComments.fire(postId, limit);
    }

}

module.exports = CommentsService