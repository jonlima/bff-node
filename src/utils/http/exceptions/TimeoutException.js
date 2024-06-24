class TimeoutException extends Error {
    constructor () {
        super('Timeout exceeded')
    }
}

module.exports = TimeoutException;