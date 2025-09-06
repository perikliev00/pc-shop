const mongoose = require('mongoose');

// Подсхема за всеки продукт от масива "products"
const productSchema = new mongoose.Schema({
  'product-title': {
    type: String,
    required: true
  },
  'product-description': {
    type: String,
    required: true
  }
}, { _id: false });

// Основна схема за документа, който ще държи данните за началната страница
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
  }, { collection: 'products' }); // <-- КАЗВАТЕ, че колекцията е "products"
// Създаваме и експортираме модела "HomeContent"
  
  module.exports = mongoose.model('HomeContent', homeContentSchema);