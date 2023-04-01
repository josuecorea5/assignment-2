const { response, request } = require('express');
const mongoose = require('mongoose');
const { OrderDetail, Invoice, Order } = require('../models');

const getOrders = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const userId = req.params.userId;
  const invoices = await Invoice.find({user: userId})
    .populate('user', 'name')  
    .skip(from).limit(limit);
  const ordersId = invoices.map((invoice) => {
    return Order.findOne({invoice: invoice._id})
  });
  const orders = await Promise.all(ordersId);

  const responseOrders = invoices.map((invoice, index) => {
    return {
      orderId: orders[index]._id,
      invoice: invoice._id,
      total: invoice.total,
      date: invoice.date,
    }
  });
  
  return res.status(200).json({
    orders: responseOrders,
    user: invoices[0].user,
  });
}

const getOrderById = async (req = request, res = response) => {
  const { id } = req.params;
  const orders = await
    OrderDetail.find({ order: id })
      .populate('order', 'invoice')
      .populate('product', 'name');

  const invoiceId = orders[0].order.invoice;
  const invoice = await Invoice.findById(invoiceId);
  res.status(200).json({
    order: orders._id,
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
  let totalProducts = products.reduce((acc, { unitPrice, quantity }) => {
    return acc + unitPrice * quantity;
  }, 0);
  totalProducts.toFixed(2);
  const sessionCreate = await mongoose.startSession();
  try {
    sessionCreate.startTransaction();
    const invoice = new Invoice({user, total: totalProducts});
    const { _id: idInvoice } = await invoice.save();
    const order = new Order({invoice: idInvoice});
    const { _id: idOrder } = await order.save();
    const orderDetails = products.map((product) => {
      return new OrderDetail({
        product: product.id,
        order: 'idOrder',
        quantity: product.quantity,
        unitPrice: product.unitPrice,
      });
    });
  await OrderDetail.insertMany(orderDetails);
  await sessionCreate.commitTransaction();
  res.status(201).json({
    message: 'Order created successfully'
  });
  } catch (error) {
    await sessionCreate.abortTransaction();
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  } finally {
    sessionCreate.endSession();
  }
};

const updateOrder = async (req, res) => {
  const sessionUpdate = await mongoose.startSession();
  const orderId = req.params.id;
  const { products } = req.body;
  const getOrderDetails = await OrderDetail.find({ order: orderId });
  const getInvoice = await Order.findOne({_id: orderId}).select('invoice');
  let invoice = await Invoice.findById(getInvoice.invoice);
  let totalProducts = products.reduce((acc, { unitPrice, quantity }) => {
    return acc + unitPrice * quantity;
  }, 0);
  totalProducts.toFixed(2);
  invoice.total = totalProducts;
  await invoice.save();
  const deleteOrderDetails = getOrderDetails.filter((orderDetail) => {
    const existProduct = products.find((product) => {
      return orderDetail.product.equals(product.id);
    });
    return !existProduct;
  }).map((orderDetail) => orderDetail._id);

  try {
    sessionUpdate.startTransaction();
    if(deleteOrderDetails.length > 0) {
      await OrderDetail.deleteMany({_id: {$in: deleteOrderDetails}});
    }
    const updatedProducts = products.map((product) => {
      const existOrderDetail =  getOrderDetails.find((orderDetail) => {
        return orderDetail.product.equals(product.id);
      });
      if (existOrderDetail) {
        return OrderDetail.findOneAndUpdate({product: product.id}, {quantity: product.quantity}, {new: true});
      }else {
        return OrderDetail.create({product: product.id, order: orderId, quantity: product.quantity, unitPrice: product.unitPrice});
      }
    });
    await Promise.all(updatedProducts);
    await sessionUpdate.commitTransaction();
    res.status(200).json({
      message: 'Order updated successfully'
    });
  } catch (error) {
    await sessionUpdate.abortTransaction();
    res.status(500).json({
      message: 'Error updating order',
    });
  } finally {
    sessionUpdate.endSession();
  }

};

module.exports = {getOrderById, createOrder, getOrders, updateOrder}