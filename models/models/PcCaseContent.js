// models/PcCaseContent.js
const mongoose = require('mongoose');

const pcCaseContentSchema = new mongoose.Schema({
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
  // Must match the collection name you'll insert your doc into
  collection: 'pccases'
});

module.exports = mongoose.model('PcCaseContent', pcCaseContentSchema);
