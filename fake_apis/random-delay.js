module.exports = (res, req, next) => {
    const delay = Math.floor(Math.random() * 2000);
    setTimeout(() => next(), delay);
}