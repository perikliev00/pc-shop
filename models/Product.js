const mongoose = require('mongoose');

// Sub-schema for each product in the "products" array
const productSchema = new mongoose.Schema({
  'product-title': {
    type: String,
    required: true
  },
  'product-description': {
    type: String,
    required: true
  }
});

// Main schema for the document that will hold the data for the home page
const homeContentSchema = new mongoose.Schema({
  'description-title': {
    type: String,
    required: true
  },
  'description': {
    type: String,
    required: true
  },
  'products': {
    type: [productSchema],
    default: []
  }
}, { collection: 'products' });

// Create and export the "HomeContent" model
module.exports = mongoose.model('HomeContent', homeContentSchema);