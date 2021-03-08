const tokenManager = {
    get: function () {
        return sessionStorage.getItem('insurance-x-csrf');
    },
    set: function (value) {
        sessionStorage.setItem('insurance-x-csrf', value)
    }
}

module.exports = tokenManager;