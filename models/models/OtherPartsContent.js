// models/OtherPartsContent.js
const mongoose = require('mongoose');

const otherPartsContentSchema = new mongoose.Schema({
  descriptionTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  products: [
    {
      productTitle: { type: String, required: true },
      productDescription: { type: String, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String, required: true }
    }
  ]
}, {
  // The actual collection name in your DB
  collection: 'otherpcparts'
});

module.exports = mongoose.model('OtherPartsContent', otherPartsContentSchema);