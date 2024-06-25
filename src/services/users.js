const CircuitBreaker = require('opossum');
const Http = require('../utils/http');
const redis = require('../utils/redis');

class UsersService {
    #client;
    #cbGetUsers;
    #cbGetUser;

    constructor () {
        this.#client = new Http('http://localhost:3003');
        this.#cbGetUsers = new CircuitBreaker(async (ids) => {
            const data = await this.#client.request({
                method: 'GET',
                path: '/users',
                query: { id: ids }
            }, { timeout: 3000 });
    
            const users = new Map();
            for (const user of data) {
                users.set(user.id, user.name)
            }
    
            return users;
        }, {
            timeout: 3000,
            errorThresholdPercentage: 50
        });

        this.#cbGetUsers.fallback(() => []);

        this.#cbGetUser = new CircuitBreaker(async (id) => {
            const key = `user:${id}`;
            const staleKey = `user-stale:${id}`;

            const dataFromCache = await redis.get(key);
            if (dataFromCache) return JSON.parse(dataFromCache);

            const data = await this.#client.request({
                method: 'GET',
                path: `/users/${id}`
            }, { timeout: 2000 });

            const result = {
                id: data.id,
                name: data.name
            }

            await redis
                .pipeline()
                .set(key, JSON.stringify(result), 'EX', 60)
                .set(staleKey, JSON.stringify(result), 'EX', 6000)
                .exec();
    
            return result;
        }, {
            timeout: 2000,
            errorThresholdPercentage: 90
        });

        this.#cbGetUser.fallback(async (id) => {
            const staleKey = `user-stale:${id}`;
            const dataFromCache = await redis.get(staleKey);
            
            if (dataFromCache) return JSON.parse(dataFromCache);

            return {};
        });
    }

    /**
     * 
     * @param {number[]} ids 
     * @returns 
     */
    async getUsers(ids) {
        return this.#cbGetUsers.fire(ids);
    }

    async getUser(id) {
        return this.#cbGetUser.fire(id);
    }   
}

module.exports = UsersService