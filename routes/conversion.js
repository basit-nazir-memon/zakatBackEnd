const express = require('express');
const mongoose = require('mongoose');
const ConversionHistory = require('../models/Conversion');

const router = express.Router();

// Route to get all conversion history
router.get('/conversion-history', async (req, res) => {
    try {
        const conversions = await ConversionHistory.find();
        res.status(200).json(conversions);
    } catch (error) {
        console.error('Error fetching conversion history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a new conversion
router.post('/conversion-history', async (req, res) => {

    let { amount, currency, type, depositor, convert, reason } = req.body;

    if (!amount || !currency || !type || !depositor || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (type == 'Convert'){
        if (!convert.date || convert.currency < 0 || !convert.rate){
            return res.status(400).json({error: "Fill all the detail of conversion"});
        }
    }else {
        convert = null;
    }

    const newConversion = new ConversionHistory({
        amount,
        currency,
        type,
        depositor,
        convert,
        reason,
    });

    try {
        await newConversion.save();
        res.status(201).json(newConversion);
    } catch (error) {
        console.error('Error saving conversion history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
