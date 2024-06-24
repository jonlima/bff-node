const Http = require('../utils/http');

class PostsService {
    #client;

    constructor () {
        this.#client = new Http('http://localhost:3001');
    }

    /**
     * 
     * @param {number} limit 
     * @returns 
     */
    async getPosts (limit = 5) {
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
    }

    /**
     * 
     * @param {number} id 
     * @returns 
     */
    async getPost (id) {
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
    }
}

module.exports = PostsService