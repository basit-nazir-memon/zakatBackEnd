const mongoose = require('mongoose');

const extraExpenditureSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be positive']
    }
}, { timestamps: true });

const ExtraExpenditure = mongoose.model('ExtraExpenditure', extraExpenditureSchema);

module.exports = ExtraExpenditure;
