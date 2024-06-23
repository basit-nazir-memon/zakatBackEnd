const mongoose = require('mongoose');

const ConvertSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    rate: { type: Number, required: true },
    currency: {type: String, required: true}
});

const ConversionHistorySchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now() },
    currency: { type: String, required: true, default: 'USD' },
    type: { type: String, enum: ['Convert', 'Receive'], required: true },
    depositor: { type: String, required: true },
    convert: ConvertSchema,
    reason: { type: String, required: true },
});

const ConversionHistory = mongoose.model('ConversionHistory', ConversionHistorySchema);

module.exports = ConversionHistory;
