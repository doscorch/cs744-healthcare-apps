const _prescriptionRepository = require('../data-repositories/prescriptions-repository');

// create prescription
function createPrescription(prescription, cb) {
    return _prescriptionRepository.createPrescription(prescription, cb);
}
module.exports.createPrescription = createPrescription;

// get all prescriptions
function getAllPrescriptions(cb) {
    _prescriptionRepository.getAllPrescriptions((err, prescriptions) => cb(err, prescriptions));
}
module.exports.getAllPrescriptions = getAllPrescriptions;

// get prescription
function getPrescription(id, cb) {
    _prescriptionRepository.getPrescription(id, (err, prescription) => cb(err, prescription));
}
module.exports.getPrescription = getPrescription;

// get prescription
function getPrescriptionsByOrderId(id, cb) {
    _prescriptionRepository.getPrescriptionsByOrderId(id, (err, prescriptions) => cb(err, prescriptions));
}
module.exports.getPrescriptionsByOrderId = getPrescriptionsByOrderId;

// partial update of prescription
function patchPrescription(prescriptionId, prescriptionPartial, cb) {
    _prescriptionRepository.patchPrescription(prescriptionId, prescriptionPartial, (err, prescription) => cb(err, prescription));
}
module.exports.patchPrescription = patchPrescription;

// delete prescription
function deletePrescription(prescriptionId, cb) {
    _prescriptionRepository.deletePrescription(prescriptionId, (err, isSuccess) => cb(err, isSuccess));
}
module.exports.deletePrescription = deletePrescription;
