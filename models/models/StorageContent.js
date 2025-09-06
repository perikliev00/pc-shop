// models/StorageContent.js
const mongoose = require('mongoose');

const storageContentSchema = new mongoose.Schema({
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
  // Ensure this matches the collection name where your doc is inserted
  collection: 'storage'
});

module.exports = mongoose.model('StorageContent', storageContentSchema);
