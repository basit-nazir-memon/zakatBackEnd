const mongoose = require('mongoose');

const AmountTermsSchema = new mongoose.Schema({
    reason: { type: String, required: true },
    amountChange: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const PaymentHistorySchema = new mongoose.Schema({
    amountChange: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const TermSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['Widow', 'Orphan', 'Poor', 'Disabled', 'Patient', 'Student'],
        required: true
    },
    type: {
        type: String,
        enum: ['Monthly', 'Yearly', 'Occasionally'],
        required: true
    },
    amountTerms: [AmountTermsSchema],
    paymentHistory: [PaymentHistorySchema],
    closureReason: { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    isClosed: {type: Boolean, default: false },
});

const ExtraFASchema = new mongoose.Schema({
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    picProof: [{ type: String }]
});

const FamilyInfoSchema = new mongoose.Schema({
    son: { type: Number, default: 0 },
    daughter: { type: Number, default: 0 },
    adopted: { type: Number, default: 0 }
});

const BeneficiarySchema = new mongoose.Schema({
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    name: { type: String, required: true },
    CNIC: { type: String, unique: true },
    ContactNumber: { type: String },
    City: { type: String, required: true },
    Area: { type: String, required: true },

    Term: [TermSchema],
    currentTerm: { type: Number, required: true },
    extraFA: [ExtraFASchema],
    isAlive: { type: Boolean, default: true },
    deathDate: { type: Date, default: null },
    familyInfo: FamilyInfoSchema,
    profession: { type: String, default: '' },
    modeOfPayment: {
        type: String,
        enum: ['Cash', 'Online', 'Person'],
        required: true
    },
    bank: { type: String, default: '' },
    accountNumber: { type: String, default: '' }
});

const Beneficiary = mongoose.model('Beneficiary', BeneficiarySchema);

module.exports = Beneficiary;
