const tokenManager = {
    get: function () {
        return sessionStorage.getItem('x-csrf');
    },
    set: function (value) {
        sessionStorage.setItem('x-csrf', value)
    }
}

module.exports = tokenManager;