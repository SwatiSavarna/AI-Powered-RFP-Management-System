const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  brand: {
    type: String,
    default: null,
  },
  qty: Number,
  specs: {
    type: Object,
    default: null
  }
  ,
  unit: String
}, { _id: false });

const Rfpschema = new mongoose.Schema({
  title: String,
  description: String, 
  structured: {
    client: String, 
    summary: String,
    budget: String,
    delivery_time: String,
    payment_terms: String,
    warranty: String,
    items: [ItemSchema]
  },
  createdAt: { type: Date, default: Date.now },
  vendorsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }]
});

module.exports = mongoose.model('RFP', Rfpschema);
