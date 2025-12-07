const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  rfp: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  rawEmail: String,
  parsed: {
    total_price: Number,
    currency: String,
    line_items: Array,
    delivery_time: String,
    payment_terms: String,
    warranty: String,
    notes: String
  },
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', ProposalSchema);
