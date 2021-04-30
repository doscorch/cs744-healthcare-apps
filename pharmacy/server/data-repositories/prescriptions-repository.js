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

function getPrescription(id, cb) {
    prescriptions.findAll({ where: { prescription_id: id } }).then(prescriptions => cb(null, prescriptions.length ? prescriptions[0].dataValues : null))
}
module.exports.getPrescription = getPrescription;

function getPrescriptionsByOrderId(id, cb) {
    prescriptions.findAll({ where: { order_id: id } }).then(prescriptions => cb(null, prescriptions.length ? prescriptions.map(p => p.dataValues) : null))
}
module.exports.getPrescriptionsByOrderId = getPrescriptionsByOrderId;


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