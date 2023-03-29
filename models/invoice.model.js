const { Schema, model } = require("mongoose");

const InvoicesSchema = Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  total: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
})

InvoicesSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
}

module.exports = model("Invoice", InvoicesSchema);