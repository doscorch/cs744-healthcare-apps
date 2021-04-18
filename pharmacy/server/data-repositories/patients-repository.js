const patients = require('./dbmodels/patient');

function createPatient(patient, cb) {
    patients.create({ ...patient })
        .then(u => cb(null, u))
        .catch(err => cb(err, null));
}
module.exports.createPatient = createPatient;

function getAllPatients(cb) {
    patients.findAll()
        .then(patients => cb(null, patients.map(u => u.dataValues)))
        .catch(err => cb(err, null));
}
module.exports.getAllPatients = getAllPatients;

function patchPatient(patientId, patientPartial, cb) {
    patients.update(patientPartial, {
        where: { patient_id: patientId }
    }).then(res => cb(null, patientPartial));
}
module.exports.patchPatient = patchPatient;

function deletePatient(patientId, cb) {
    patients.destroy({
        where: { patient_id: patientId }
    }).then(res => cb(null, true));
}
module.exports.deletePatient = deletePatient;

function getPatient(id, cb) {
    patients.findAll({ where: { patient_id: id } }).then(patients => cb(null, patients.length ? patients[0].dataValues : null))
}
module.exports.getPatient = getPatient;