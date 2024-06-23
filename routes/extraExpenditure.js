const express = require('express');
const mongoose = require('mongoose');
const z = require('zod');
const ExtraExpenditure = require('../models/ExtraExpense');
const router = express.Router();

// Define the validation schema for Extra Expenditure
const extraExpenditureSchema = z.object({
    reason: z.string().min(1, { message: 'Reason is required' }),
    amount: z.number().min(0, { message: 'Amount must be positive' })
});

// Route to get all extra expenditures
router.get('/extraexpenditures', async (req, res) => {
    try {
        const expenditures = await ExtraExpenditure.find();
        res.json(expenditures);
    } catch (error) {
        console.error('Error fetching extra expenditures:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a new extra expenditure
router.post('/extraexpenditures/add', async (req, res) => {
    try {
        const result = extraExpenditureSchema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const newExpenditure = new ExtraExpenditure(result.data);
        await newExpenditure.save();
    
        res.status(201).json({ message: 'Extra Expenditure added successfully', expenditure: newExpenditure });
    } catch (error) {
        console.error('Error adding extra expenditure:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
