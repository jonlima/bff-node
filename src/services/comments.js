const Http = require('../utils/http');

class CommentsService {
    #client;

    constructor () {
        this.#client = new Http('http://localhost:3002');
    }

    /**
     * 
     * @param {number} postId 
     * @param {number} limit 
     */
    async getComments (postId, limit = 5) {
        try {
            const comments = [];
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

            return comments;
        } catch (error) {
            console.log(error.message);
            return [];
        }
    }

}

module.exports = CommentsService