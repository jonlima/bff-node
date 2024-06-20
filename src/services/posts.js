const { Client } = require('undici');

class PostsService {
    #client;

    constructor () {
        this.#client = new Client('http://localhost:3001');
    }

    /**
     * 
     * @param {number} limit 
     * @returns 
     */
    async getPosts (limit = 5) {
        const posts = [];
        const response = await this.#client.request({
            method: 'GET',
            path: '/posts'
        });

        const data = await response.body.json();
        
        for (const post of data) {
            if (posts.length >= limit) continue;

            posts.push({
                id: post.id,
                authorId: post.authorId,
                title: post.title
            })
        }

        return posts;
    }

    /**
     * 
     * @param {number} id 
     * @returns 
     */
    async getPost (id) {
        const posts = [];
        const response = await this.#client.request({
            method: 'GET',
            path: `/posts/${id}`
        });

        const data = await response.body.json();

        return {
            id: data.id,
            title: data.title,
            text: data.text,
            authorId: data.authorId
        };
    }
}

module.exports = PostsService