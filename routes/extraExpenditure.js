const express = require('express');
const mongoose = require('mongoose');
const z = require('zod');
const ExtraExpenditure = require('../models/ExtraExpense');
const addExpenseEntry = require('../middleware/addRecord');
const Account = require('../models/Account');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Define the validation schema for Extra Expenditure
const extraExpenditureSchema = z.object({
    reason: z.string().min(1, { message: 'Reason is required' }),
    amount: z.number().min(0, { message: 'Amount must be positive' })
});

// Route to get all extra expenditures
router.get('/extraexpenditures', auth, async (req, res) => {
    try {
        const expenditures = await ExtraExpenditure.find();
        expenditures.reverse();
        res.json(expenditures);
    } catch (error) {
        console.error('Error fetching extra expenditures:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a new extra expenditure
router.post('/extraexpenditures/add', auth, admin, async (req, res) => {
    try {
        const result = extraExpenditureSchema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const newExpenditure = new ExtraExpenditure(result.data);

        const account = await Account.findOne();

        if (!account) {
            return res.status(404).send({ error: 'Account not found' });
        }

        await newExpenditure.save();

        // Removing the Amount From Account
        await account.logTransaction( -1 * newExpenditure.amount, "PKR", "Extra Expense", `An Amount of ${newExpenditure.amount}PKR has been deducted for the extra expense entry due to the reason: ${newExpenditure.reason}`);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.toLocaleString('default', { month: 'short' });
        addExpenseEntry(currentYear, currentMonth, newExpenditure.amount, `An Amount of ${newExpenditure.amount}PKR has been deducted for the extra expense entry due to the reason: ${newExpenditure.reason}`);

        res.status(201).json({ message: 'Extra Expenditure added successfully' });
    } catch (error) {
        console.error('Error adding extra expenditure:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
