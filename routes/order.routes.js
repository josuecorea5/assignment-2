const { Router } = require('express');
const { getOrders, createOrder } = require('../controllers/order.controller');

const router = Router();

router.get('/:id', getOrders)

router.post('/', createOrder);

module.exports = router;