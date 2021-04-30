const express = require('express');
const router = express.Router();
const _orderService = require('../services/orders-service');
const { isAuthenticated, isPharmacist } = require('../middleware/auth');

// get orders
router.get('/', isAuthenticated, isPharmacist, function (req, res) {
    _orderService.getAllOrders(function (err, orders) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(orders);
        return;
    });
});

// post order
router.post('/', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.body) {
        res.status('400').send();
        return;
    }

    _orderService.createOrder(req.body, function (err, order) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(order);
        return;
    });
});

// patch a order
router.patch('/:orderId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.orderId || !req.body) {
        res.status('400').send();
        return;
    }

    _orderService.patchOrder(req.params.orderId, req.body, function (err, order) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(order);
        return;
    });
});

// delete a order
router.delete('/:orderId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.orderId) {
        res.status('400').send();
        return;
    }

    _orderService.deleteOrder(req.params.orderId, function (err, order) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(order);
        return;
    });
});

// get a order
router.get('/:orderId', isAuthenticated, isPharmacist, function (req, res) {
    console.log('here');
    if (!req.params.orderId || !req.body) {
        res.status('400').send();
        return;
    }

    _orderService.getOrder(req.params.orderId, function (err, order) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(order);
        return;
    });
});

module.exports = router;
