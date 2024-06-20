const PostsService = require('../services/posts');
const postService = new PostsService();

class PostsController {
    async getPosts () {
        const posts = await postService.getPosts();
        return posts;
    }

    /**
     * 
     * @param {number} id 
     */
    async getPost (id) {
        const post = await postService.getPost(id);
        return post;
    }
}

module.exports = PostsController;