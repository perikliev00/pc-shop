// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productTitle: {
    type: String,        // Copy of the product's title
    required: true
  },
  prod
}, {
  collection: 'cart'    // Name of the MongoDB collection
});

module.exports = mongoose.model('Cart', cartSchema);
