var GUID = require('./guid').GUID;

class Token {
    constructor() {
        this.value = GUID.create();
    }
}

module.exports = Token;