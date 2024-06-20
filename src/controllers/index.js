const PostsService = require('../services/posts');
const CommentsService = require('../services/comments');

const postService = new PostsService();
const commentsService = new CommentsService()

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
        const [post, comments] = await Promise.all([
            postService.getPost(id),
            commentsService.getComments(id)
        ])

        return { ...post, comments };
    }
}

module.exports = PostsController;