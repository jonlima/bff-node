class PostsController {
    constructor () {}

    async getPosts () {
        return [
            { id: 1},
            { id: 2}
        ]
    }

    /**
     * 
     * @param {*} id 
     */
    async getPost (id) {
        return { id: 1 }
    }
}

module.exports = PostsController;