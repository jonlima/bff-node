const CircuitBreaker = require('opossum');
const Http = require('../utils/http');

class PostsService {
    #client;
    #cbGetPosts;
    #cbGetPost;

    constructor () {
        this.#client = new Http('http://localhost:3001');
        this.#cbGetPosts= new CircuitBreaker(async (limit) => {
            const posts = [];
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

            return posts;
        }, {
            timeout: 5000,
            errorThresholdPercentage: 10
        });
        this.#cbGetPosts.fallback(() => []);

        this.#cbGetPost = new CircuitBreaker(async (id) => {
            const posts = [];
            const data = await this.#client.request({
                method: 'GET',
                path: `/posts/${id}`
            }, { timeout: 5000 });


            return {
                id: data.id,
                title: data.title,
                text: data.text,
                authorId: data.authorId
            };
        }, {
            timeout: 5000,
            errorThresholdPercentage: 10
        });

        this.#cbGetPost.fallback(() => ({}));
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