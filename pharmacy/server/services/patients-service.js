const _patientRepository = require('../data-repositories/patients-repository');

// create patient
function createPatient(patient, cb) {
    _patientRepository.createPatient(patient, cb);
}
module.exports.createPatient = createPatient;

// get all patients
function getAllPatients(cb) {
    _patientRepository.getAllPatients((err, patients) => cb(err, patients));
}
module.exports.getAllPatients = getAllPatients;

// partial update of patient
function patchPatient(patientId, patientPartial, cb) {
    _patientRepository.patchPatient(patientId, patientPartial, (err, patient) => cb(err, patient));
}
module.exports.patchPatient = patchPatient;

// delete patient
function deletePatient(patientId, cb) {
    _patientRepository.deletePatient(patientId, (err, isSuccess) => cb(err, isSuccess));
}
module.exports.deletePatient = deletePatient;

// get patient
function getPatient(id, cb) {
    _patientRepository.getPatient(id, (err, patient) => cb(err, patient));
}
module.exports.getPatient = getPatient;
