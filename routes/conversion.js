const express = require('express');
const mongoose = require('mongoose');
const ConversionHistory = require('../models/Conversion');
const Account = require('../models/Account');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Route to get all conversion history
router.get('/conversion-history', auth, async (req, res) => {
    try {
        const conversions = await ConversionHistory.find();
        conversions.reverse();
        res.status(200).json(conversions);
    } catch (error) {
        console.error('Error fetching conversion history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a new conversion
router.post('/conversion-history', auth, admin, async (req, res) => {

    let { amount, currency, type, depositor, convert, reason } = req.body;

    if (!amount || !currency || !type || !depositor || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (type == 'Convert'){
        if (!convert.date || convert.currency < 0 || !convert.rate){
            return res.status(400).json({error: "Fill all the detail of conversion"});
        }
        if (currency == convert.currency) {
            return res.status(400).json({ error: 'Both Currencies Cannot be Same' });
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
        const account = await Account.findOne();

        if (!account) {
            return res.status(404).send({ error: 'Account not found' });
        }

        await newConversion.save();

        if (type == 'Convert'){
            // Removing the Amount From Account
            await account.logTransaction( -1 * amount, currency, "Currency Conversion - Amount Deduction", `An Amount of ${amount} ${currency} has been deducted due to conversion from ${currency} to ${convert.currency}`);

            // Adding the Converted Amount To Account
            await account.logTransaction( amount * convert.rate, convert.currency, "Currency Conversion - Amount Addition", `An Amount of ${amount * convert.rate} ${convert.currency} has been added due to conversion from ${currency} to ${convert.currency}`);

        }else {
            await account.logTransaction(amount, currency, "Currency Inflow / Deposit", `An amount of ${amount} ${currency} has been deposited by ${depositor} due to this reason ${reason}`);
        }

        res.status(201).json(newConversion);

    } catch (error) {
        console.error('Error saving conversion history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
