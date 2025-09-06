const mongoose = require('mongoose');

const cpuContentSchema = new mongoose.Schema({
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
  // Make sure this matches the actual collection where you inserted the doc
  collection: 'cpu'
});

module.exports = mongoose.model('CpuContent', cpuContentSchema);