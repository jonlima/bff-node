const Http = require('../utils/http');

class UsersService {
    #client;

    constructor () {
        this.#client = new Http('http://localhost:3003');
    }

    /**
     * 
     * @param {number[]} ids 
     * @returns 
     */
    async getUsers(ids) {
        const data = await this.#client.request({
            method: 'GET',
            path: '/users',
            query: { id: ids }
        }, { timeout: 5000 });

        const users = new Map();
        for (const user of data) {
            users.set(user.id, user.name)
        }

        return users;
    }

    async getUser(id) {
        const data = await this.#client.request({
            method: 'GET',
            path: `/users/${id}`
        }, { timeout: 2000 });

        return data;
    }
}

module.exports = UsersService