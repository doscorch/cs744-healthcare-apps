const tokenManager = {
    get: function () {
        return sessionStorage.getItem('pharmacy-x-csrf');
    },
    set: function (value) {
        sessionStorage.setItem('pharmacy-x-csrf', value)
    }
}

module.exports = tokenManager;