const _medicineRepository = require('../data-repositories/medicines-repository');

// create medicine
function createMedicine(medicine, cb) {
    _medicineRepository.createMedicine(medicine, cb);
}
module.exports.createMedicine = createMedicine;

// get all medicines
function getAllMedicines(cb) {
    _medicineRepository.getAllMedicines((err, medicines) => cb(err, medicines));
}
module.exports.getAllMedicines = getAllMedicines;

// partial update of medicine
function patchMedicine(medicineId, medicinePartial, cb) {
    _medicineRepository.patchMedicine(medicineId, medicinePartial, (err, medicine) => cb(err, medicine));
}
module.exports.patchMedicine = patchMedicine;

// delete medicine
function deleteMedicine(medicineId, cb) {
    _medicineRepository.deleteMedicine(medicineId, (err, isSuccess) => cb(err, isSuccess));
}
module.exports.deleteMedicine = deleteMedicine;

// get medicine
function getMedicine(id, cb) {
    _medicineRepository.getMedicine(id, (err, medicine) => cb(err, medicine));
}
module.exports.getMedicine = getMedicine;