const { v4: uuidv4 } = require('uuid');

const GUID = new class Guid {
    create() {
        return uuidv4();
    }
}

module.exports.GUID = GUID;