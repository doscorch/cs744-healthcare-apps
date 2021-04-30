const orders = require('./dbmodels/order');

function createOrder(order, cb) {
    orders.create({ ...order })
        .then(u => cb(null, u))
        .catch(err => cb(err, null));
}
module.exports.createOrder = createOrder;

function getAllOrders(cb) {
    orders.findAll()
        .then(orders => cb(null, orders.map(u => u.dataValues)))
        .catch(err => cb(err, null));
}
module.exports.getAllOrders = getAllOrders;

function patchOrder(orderId, orderPartial, cb) {
    orders.update(orderPartial, {
        where: { medicine_order_id: orderId }
    }).then(res => cb(null, orderPartial));
}
module.exports.patchOrder = patchOrder;

function deleteOrder(orderId, cb) {
    orders.destroy({
        where: { medicine_order_id: orderId }
    }).then(res => cb(null, true));
}
module.exports.deleteOrder = deleteOrder;

function getOrder(id, cb) {
    orders.findAll({ where: { medicine_order_id: id } }).then(orders => cb(null, orders.length ? orders[0].dataValues : null))
}
module.exports.getOrder = getOrder;