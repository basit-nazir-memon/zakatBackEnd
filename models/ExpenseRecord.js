const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for details
const DetailSchema = new Schema({
    date: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    details: { type: String, required: true },
});

// Define schema for months
const MonthSchema = new Schema({
    amount: { type: Number, default: 0},
    details: [DetailSchema]
});

// Define schema for years
const YearSchema = new Schema({
    year: { type: Number, required: true },
    months: {
        Jan: { type: MonthSchema, default: {} },
        Feb: { type: MonthSchema, default: {} },
        Mar: { type: MonthSchema, default: {} },
        Apr: { type: MonthSchema, default: {} },
        May: { type: MonthSchema, default: {} },
        Jun: { type: MonthSchema, default: {} },
        Jul: { type: MonthSchema, default: {} },
        Aug: { type: MonthSchema, default: {} },
        Sep: { type: MonthSchema, default: {} },
        Oct: { type: MonthSchema, default: {} },
        Nov: { type: MonthSchema, default: {} },
        Dec: { type: MonthSchema, default: {} }
    }
});

// Define the main schema for the expense record
const ExpenseRecordSchema = new Schema({
    years: [YearSchema]
});

// Create the Mongoose model
const ExpenseRecord = mongoose.model('ExpenseRecord', ExpenseRecordSchema);

module.exports = ExpenseRecord;