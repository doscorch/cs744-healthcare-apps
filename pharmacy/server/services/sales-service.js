const _saleRepository = require('../data-repositories/sales-repository');

// create sale
function createSale(sale, cb) {
    _saleRepository.createSale(sale, cb);
}
module.exports.createSale = createSale;

// get all sales
function getAllSales(cb) {
    _saleRepository.getAllSales((err, sales) => cb(err, sales));
}
module.exports.getAllSales = getAllSales;

// partial update of sale
function patchSale(saleId, salePartial, cb) {
    _saleRepository.patchSale(saleId, salePartial, (err, sale) => cb(err, sale));
}
module.exports.patchSale = patchSale;

// delete sale
function deleteSale(saleId, cb) {
    _saleRepository.deleteSale(saleId, (err, isSuccess) => cb(err, isSuccess));
}
module.exports.deleteSale = deleteSale;

// get sale
function getSale(id, cb) {
    _saleRepository.getSale(id, (err, sale) => cb(err, sale));
}
module.exports.getSale = getSale;

// get sale
function getSalesByOrderId(id, cb) {
    _saleRepository.getSalesByOrderId(id, (err, sales) => cb(err, sales));
}
module.exports.getSalesByOrderId = getSalesByOrderId;