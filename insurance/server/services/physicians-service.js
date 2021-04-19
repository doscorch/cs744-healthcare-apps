const _physicianRepository = require('../data-repositories/physicians-repository');

// create physician
function createPhysician(physician, cb) {
    _physicianRepository.createPhysician(physician, cb);
}
module.exports.createPhysician = createPhysician;

// get all physicians
function getAllPhysicians(cb) {
    _physicianRepository.getAllPhysicians((err, physicians) => cb(err, physicians));
}
module.exports.getAllPhysicians = getAllPhysicians;

// partial update of physician
function patchPhysician(physicianId, physicianPartial, cb) {
    _physicianRepository.patchPhysician(physicianId, physicianPartial, (err, physician) => cb(err, physician));
}
module.exports.patchPhysician = patchPhysician;

// delete physician
function deletePhysician(physicianId, cb) {
    _physicianRepository.deletePhysician(physicianId, (err, isSuccess) => cb(err, isSuccess));
}
module.exports.deletePhysician = deletePhysician;

// get physician
function getPhysician(id, cb) {
    _physicianRepository.getPhysician(id, (err, physician) => cb(err, physician));
}
module.exports.getPhysician = getPhysician;
