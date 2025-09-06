// models/CoresContent.js
const mongoose = require('mongoose');

const coresContentSchema = new mongoose.Schema({
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
  // Make sure this matches the actual collection name in your DB
  collection: 'cores'
});

module.exports = mongoose.model('CoresContent', coresContentSchema);
// models/CpuContent.js