const CircuitBreaker = require('opossum');
const Http = require('../utils/http');
const redis = require('../utils/redis');

class PostsService {
    #client;
    #cbGetPosts;
    #cbGetPost;

    constructor () {
        this.#client = new Http('http://localhost:3001');
        this.#cbGetPosts= new CircuitBreaker(async (limit) => {
            const posts = [];

            const key = `posts:limit-${limit}`;
            const staleKey = `posts-stale:limit-${limit}`;
            const dataFromCache = await redis.get(key);
            if (dataFromCache) return JSON.parse(dataFromCache);

            const data = await this.#client.request({
                method: 'GET',
                path: '/posts'
            }, { timeout: 5000 });
            
            for (const post of data) {
                if (posts.length >= limit) continue;

                posts.push({
                    id: post.id,
                    authorId: post.authorId,
                    title: post.title
                })
            }

            await redis
                .pipeline()
                .set(key, JSON.stringify(posts), 'EX', 60)
                .set(staleKey, JSON.stringify(posts), 'EX', 6000)
                .exec();

            return posts;
        }, {
            timeout: 5000,
            errorThresholdPercentage: 10
        });

        this.#cbGetPosts.fallback(async (limit) => {
            const staleKey = `posts-stale:limit-${limit}`;
            const dataFromCache = await redis.get(staleKey);
            if (dataFromCache) return JSON.parse(dataFromCache);

            return [];
        });

        this.#cbGetPost = new CircuitBreaker(async (id) => {
            const posts = [];
            
            const key = `post:${id}`;
            const staleKey = `post-stale:${id}`;
            const dataFromCache = await redis.get(key);
            if (dataFromCache) return JSON.parse(dataFromCache);

            const data = await this.#client.request({
                method: 'GET',
                path: `/posts/${id}`
            }, { timeout: 5000 });


            const result = {
                id: data.id,
                title: data.title,
                text: data.text,
                authorId: data.authorId
            };

            await redis
                .pipeline()
                .set(key, JSON.stringify(result), 'EX', 60)
                .set(staleKey, JSON.stringify(result), 'EX', 6000)
                .exec();

            return result;
        }, {
            timeout: 5000,
            errorThresholdPercentage: 10
        });

        this.#cbGetPost.fallback( async (id) => {
            const staleKey = `post-stale:${id}`;
            const dataFromCache = await redis.get(staleKey);
            if (dataFromCache) return JSON.parse(dataFromCache);

            return {}
        });
    }

    /**
     * 
     * @param {number} limit 
     * @returns 
     */
    async getPosts (limit = 5) {
        return this.#cbGetPosts.fire(limit);
    }

    /**
     * 
     * @param {number} id 
     * @returns 
     */
    async getPost (id) {
        return this.#cbGetPost.fire(id);
    }
}

module.exports = PostsService