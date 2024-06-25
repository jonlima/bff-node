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

            const key = `comments:${postId}:limit-${limit}`;
            const stalekey = `comments-stale:${postId}:limit-${limit}`;
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

            await redis
                .pipeline()
                .set(key, JSON.stringify(comments), 'EX', 60)
                .set(stalekey, JSON.stringify(comments), 'EX', 6000)
                .exec()

            return comments;
        }, {
            errorThresholdPercentage: 10,
            resetTimeout: 10000,
            timeout: 1000
        });
        this.#cbGetComments.fallback(async (postId, limit = 5) => {
            const stalekey = `comments-stale:${postId}:limit-${limit}`;
            const dataFromCache = await redis.get(stalekey);
            if (dataFromCache) return JSON.parse(dataFromCache);

            return [];
        });
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