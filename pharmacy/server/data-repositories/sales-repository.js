const sales = require('./dbmodels/sale');

function createSale(sale, cb) {
    sales.create({ ...sale })
        .then(u => cb(null, u))
        .catch(err => cb(err, null));
}
module.exports.createSale = createSale;

function getAllSales(cb) {
    sales.findAll()
        .then(sales => cb(null, sales.map(u => u.dataValues)))
        .catch(err => cb(err, null));
}
module.exports.getAllSales = getAllSales;

function patchSale(saleId, salePartial, cb) {
    sales.update(salePartial, {
        where: { sale_id: saleId }
    }).then(res => cb(null, salePartial));
}
module.exports.patchSale = patchSale;

function deleteSale(saleId, cb) {
    sales.destroy({
        where: { sale_id: saleId }
    }).then(res => cb(null, true));
}
module.exports.deleteSale = deleteSale;

function getSale(id, cb) {
    sales.findAll({ where: { sale_id: id } }).then(sales => cb(null, sales.length ? sales[0].dataValues : null))
}
module.exports.getSale = getSale;

function getSalesByOrderId(id, cb) {
    sales.findAll({ where: { order_id: id } }).then(sales => cb(null, sales.length ? sales.map(p => p.dataValues) : null))
}
module.exports.getSalesByOrderId = getSalesByOrderId;