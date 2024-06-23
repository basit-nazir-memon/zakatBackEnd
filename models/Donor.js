// Import mongoose
const mongoose = require('mongoose');

// Define the yearlyAmount sub-schema
const yearlyAmountSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Zakat', 'Sadqah', 'Fitra', 'Kherat'],
        required: true
    }
}, { _id: false });

// Define the main donor schema
const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    yearlyAmount: [yearlyAmountSchema],
    contactNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Create the Donor model
const Donor = mongoose.model('Donor', donorSchema);

// Export the model
module.exports = Donor;
