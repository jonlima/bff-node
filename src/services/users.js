const { Client } = require('undici');

class UsersService {
    #client;

    constructor () {
        this.#client = new Client('http://localhost:3003');
    }

    /**
     * 
     * @param {number[]} ids 
     * @returns 
     */
    async getUsers(ids) {
        const request = await this.#client.request({
            method: 'GET',
            path: '/users',
            query: { id: ids }
        });
        const data = await request.body.json();

        const users = new Map();
        for (const user of data) {
            users.set(user.id, user.name)
        }

        return users;
    }

    async getUser(id) {
        const request = await this.#client.request({
            method: 'GET',
            path: `/users/${id}`
        });
        const data = await request.body.json();

        return data;
    }
}

module.exports = UsersService