const { Router } = require('express');
const { getOrderById, createOrder, getOrders } = require('../controllers/order.controller');

const router = Router();

router.get('/user/:userId', getOrders);

router.get('/:id', getOrderById);

router.post('/', createOrder);

module.exports = router;