const { response, request } = require('express');
const { OrderDetail, Invoice, Order } = require('../models');

const getOrders = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const { id } = req.params;
  console.log(id);
  const [orders, total] = await Promise.all([
    OrderDetail.find({ order: id })
      .populate('order', 'invoice')
      .populate('product', 'name')
      .skip(from)
      .limit(limit),
      OrderDetail.countDocuments({ order: id })
  ]);
  const invoiceId = orders[0].order.invoice;
  console.log(orders);
  const invoice = await Invoice.findById(invoiceId);
  res.status(200).json({
    order: orders[0]._id,
    products: orders.map((order) => {
      return {
        product: order.product, 
        quantity: order.quantity, 
        unitPrice: order.unitPrice
      }
    }),
    total: invoice.total,
    date: invoice.date,
    });
};

const createOrder = async (req, res = response) => {
  const { user, products } = req.body;
  const total = products.reduce((acc, { unitPrice, quantity }) => {
    return acc + unitPrice * quantity;
  }, 0);
  const invoice = new Invoice({user, total});
  const { _id: idInvoice } = await invoice.save();
  const order = new Order({invoice: idInvoice});
  const { _id: idOrder } = await order.save();
  const orderDetails = products.map((product) => {
    return new OrderDetail({
      product: product.id,
      order: idOrder,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
    });
  });
  console.log(orderDetails);
  await OrderDetail.insertMany(orderDetails);
  res.status(201).json({
    message: 'Order created successfully'
  });
};

module.exports = {getOrders, createOrder}