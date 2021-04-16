const prescriptions = require('./dbmodels/prescription');

function createPrescription(prescription, cb) {
    return prescriptions.create({ ...prescription })
        .then(u => cb(null, u))
        .catch(err => cb(err, null));
}
module.exports.createPrescription = createPrescription;

function getAllPrescriptions(cb) {
    prescriptions.findAll()
        .then(prescriptions => cb(null, prescriptions.map(u => u.dataValues)))
        .catch(err => cb(err, null));
}
module.exports.getAllPrescriptions = getAllPrescriptions;

function patchPrescription(prescriptionId, prescriptionPartial, cb) {
    prescriptions.update(prescriptionPartial, {
        where: { prescription_id: prescriptionId }
    }).then(res => cb(null, prescriptionPartial));
}
module.exports.patchPrescription = patchPrescription;

function deletePrescription(prescriptionId, cb) {
    prescriptions.destroy({
        where: { prescription_id: prescriptionId }
    }).then(res => cb(null, true));
}
module.exports.deletePrescription = deletePrescription;