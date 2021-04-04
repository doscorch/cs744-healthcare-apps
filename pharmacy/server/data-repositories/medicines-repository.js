const medicines = require('./dbmodels/medicine');

function createMedicine(medicine, cb) {
    medicines.create({ ...medicine })
        .then(u => cb(null, u))
        .catch(err => cb(err, null));
}
module.exports.createMedicine = createMedicine;

function getAllMedicines(cb) {
    medicines.findAll()
        .then(medicines => cb(null, medicines.map(u => u.dataValues)))
        .catch(err => cb(err, null));
}
module.exports.getAllMedicines = getAllMedicines;

function patchMedicine(medicineId, medicinePartial, cb) {
    medicines.update(medicinePartial, {
        where: { medicine_id: medicineId }
    }).then(res => cb(null, medicinePartial));
}
module.exports.patchMedicine = patchMedicine;

function deleteMedicine(medicineId, cb) {
    medicines.destroy({
        where: { medicine_id: medicineId }
    }).then(res => cb(null, true));
}
module.exports.deleteMedicine = deleteMedicine;