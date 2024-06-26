const mongoose = require('mongoose');

// Define the schema for transaction log entries
const TransactionLogSchema = new mongoose.Schema({
    amountPKRBeforeTransaction: { type: Number, required: true, default: 0 },
    amountUSDBeforeTransaction: { type: Number, required: true, default: 0 },
    amountPKRAfterTransaction: { type: Number, required: true, default: 0 },
    amountUSDAfterTransaction: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    title: { type: String, required: true },
    details: { type: String, required: true },
});

// Define the main schema that includes total amounts in PKR and USD and an array of transaction logs
const AccountSchema = new mongoose.Schema({
    totalAmountPKR: { type: Number, required: true, default: 0 },
    totalAmountUSD: { type: Number, required: true, default: 0 },
    transactionLogs: [TransactionLogSchema],
});

// Method to log a transaction and update totals
AccountSchema.methods.logTransaction = async function(amount, currency, title, details) {
    const account = this;

    // Record the amounts before the transaction
    const amountPKRBeforeTransaction = account.totalAmountPKR;
    const amountUSDBeforeTransaction = account.totalAmountUSD;

    // Update the totals based on the transaction
    if (currency === 'PKR') {
        account.totalAmountPKR += amount;
    } else if (currency === 'USD') {
        account.totalAmountUSD += amount;
    } else {
        throw new Error('Unsupported currency');
    }

    // Record the amounts after the transaction
    const amountPKRAfterTransaction = account.totalAmountPKR;
    const amountUSDAfterTransaction = account.totalAmountUSD;

    // Create a new transaction log entry
    const transactionLog = {
        amountPKRBeforeTransaction,
        amountUSDBeforeTransaction,
        amountPKRAfterTransaction,
        amountUSDAfterTransaction,
        date: new Date(),
        amount,
        currency,
        title,
        details,
    };

    // Add the transaction log to the account
    account.transactionLogs.push(transactionLog);

    // Save the updated account
    await account.save();

    return account;
};

// Create the Mongoose model
const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
