const express = require('express');
const router = express.Router();
const _saleService = require('../services/sales-service');
const { isAuthenticated, isPharmacist } = require('../middleware/auth');

// get sales
router.get('/', isAuthenticated, isPharmacist, function (req, res) {
    _saleService.getAllSales(function (err, sales) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(sales);
        return;
    });
});

// get sales by order id
router.get('/order/:orderId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.orderId) {
        res.status('400').send();
        return;
    }

    console.log(req.params.orderId);

    _saleService.getSalesByOrderId(req.params.orderId, function (err, sales) {
        console.log(sales)
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(sales);
        return;
    });
});

// post sale
router.post('/', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.body) {
        res.status('400').send();
        return;
    }

    _saleService.createSale(req.body, function (err, sale) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(sale);
        return;
    });
});

// patch a sale
router.patch('/:saleId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.saleId || !req.body) {
        res.status('400').send();
        return;
    }

    _saleService.patchSale(req.params.saleId, req.body, function (err, sale) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(sale);
        return;
    });
});

// delete a sale
router.delete('/:saleId', isAuthenticated, isPharmacist, function (req, res) {
    if (!req.params.saleId) {
        res.status('400').send();
        return;
    }

    _saleService.deleteSale(req.params.saleId, function (err, sale) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(sale);
        return;
    });
});

// get a sale
router.get('/:saleId', isAuthenticated, isPharmacist, function (req, res) {
    console.log('here');
    if (!req.params.saleId || !req.body) {
        res.status('400').send();
        return;
    }

    _saleService.getSale(req.params.saleId, function (err, sale) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(sale);
        return;
    });
});

module.exports = router;
