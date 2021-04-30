const _orderRepository = require('../data-repositories/orders-repository');

// create order
function createOrder(order, cb) {
    _orderRepository.createOrder(order, cb);
}
module.exports.createOrder = createOrder;

// get all orders
function getAllOrders(cb) {
    _orderRepository.getAllOrders((err, orders) => cb(err, orders));
}
module.exports.getAllOrders = getAllOrders;

// partial update of order
function patchOrder(orderId, orderPartial, cb) {
    _orderRepository.patchOrder(orderId, orderPartial, (err, order) => cb(err, order));
}
module.exports.patchOrder = patchOrder;

// delete order
function deleteOrder(orderId, cb) {
    _orderRepository.deleteOrder(orderId, (err, isSuccess) => cb(err, isSuccess));
}
module.exports.deleteOrder = deleteOrder;

// get order
function getOrder(id, cb) {
    _orderRepository.getOrder(id, (err, order) => cb(err, order));
}
module.exports.getOrder = getOrder;
