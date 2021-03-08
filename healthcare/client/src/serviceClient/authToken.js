const tokenManager = {
    get: function () {
        return sessionStorage.getItem('healthcare-x-csrf');
    },
    set: function (value) {
        sessionStorage.setItem('healthcare-x-csrf', value)
    }
}

module.exports = tokenManager;