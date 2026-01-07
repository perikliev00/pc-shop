const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// NEW: order item schema (no subdocument _id needed)
const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  notes: {
    type: String,
  },
  // CHANGED: items now use productId (not _id)
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // REMOVED: custom required _id field (let mongoose generate it)
}, {
  collection: 'Orders'
});


module.exports = mongoose.model('Order', orderSchema);