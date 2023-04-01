const { Router } = require('express');
const { check } = require('express-validator');
const { getOrderById, createOrder, getOrders, updateOrder } = require('../controllers/order.controller');
const { userByIdExist, productExistById } = require('../helpers/db-validators');
const { validateFields, validateJWT } = require('../middleware');

const router = Router();

router.get('/user/:userId', getOrders);

router.get('/:id', getOrderById);

router.post(
  '/', 
  [
    check('user', 'user is mandatory').not().isEmpty(),
    check('user').custom(userByIdExist),
    check('products', 'products is mandatory').not().isEmpty(),
    check('products.*.id').custom(productExistById),
    check('products.*.quantity').isInt({min: 1, max: 7}).withMessage('you can only buy between 1 and 7 products'),
    check('products.*.unitPrice').isFloat({min: 1}).withMessage('quantity not valid'),
    check('products').isArray({max: 10}).withMessage('you can only buy 10 products'),
    validateJWT,
    validateFields
  ],
  createOrder
  );

router.patch(
  '/:id', 
  [
    check('user', 'user is mandatory').not().isEmpty(),
    check('user').custom(userByIdExist),
    check('products', 'products is mandatory').not().isEmpty(),
    check('products.*.id').custom(productExistById),
    check('products.*.quantity').isInt({min: 1, max: 7}).withMessage('you can only buy between 1 and 7 products'),
    check('products.*.unitPrice').isFloat({min: 1}).withMessage('quantity not valid'),
    check('products').isArray({max: 10}).withMessage('you can only buy 10 products'),
    validateJWT,
    validateFields
  ],
  updateOrder);

module.exports = router;