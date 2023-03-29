const { Schema, model } = require('mongoose');

const OrdersSchema = Schema({
  invoice: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true,
  }
});

module.exports = model('Order', OrdersSchema);