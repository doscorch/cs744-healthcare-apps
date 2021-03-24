const physicians = require('./dbmodels/physician');

function createPhysician(physician, cb) {
    physicians.create({ ...physician })
        .then(u => cb(null, u))
        .catch(err => cb(err, null));
}
module.exports.createPhysician = createPhysician;

function getAllPhysicians(cb) {
    physicians.findAll()
        .then(physicians => cb(null, physicians.map(u => u.dataValues)))
        .catch(err => cb(err, null));
}
module.exports.getAllPhysicians = getAllPhysicians;

function patchPhysician(physicianId, physicianPartial, cb) {
    physicians.update(physicianPartial, {
        where: { physician_id: physicianId }
    }).then(res => cb(null, physicianPartial));
}
module.exports.patchPhysician = patchPhysician;

function deletePhysician(physicianId, cb) {
    physicians.destroy({
        where: { physician_id: physicianId }
    }).then(res => cb(null, true));
}
module.exports.deletePhysician = deletePhysician;