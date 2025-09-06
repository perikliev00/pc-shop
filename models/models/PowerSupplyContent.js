// models/PowerSupplyContent.js
const mongoose = require('mongoose');

const powerSupplyContentSchema = new mongoose.Schema({
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
  // Must match the collection name where you’ll insert your doc
  collection: 'powersupply'
});

module.exports = mongoose.model('PowerSupplyContent', powerSupplyContentSchema);
