const express = require('express');
const DemandList = require('../models/DemandList');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();


router.get('/demand-lists', auth, async (req, res) => {
    try {
        const demandLists = await DemandList.find()
            .populate('PersonId', 'firstName lastName')
            .populate('viewers', 'firstName lastName')
            .populate('Comments.originator', 'firstName lastName avatar')
            .populate('Comments.reply.replier', 'firstName lastName avatar');
        res.json(demandLists);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching demand lists.' });
    }
});

router.post('/demand-lists', auth, admin, async (req, res) => {
    try {

        const PersonId = "6673bdcc8d6a5904a5eb6482";
        const { Need, Reason, isApproved } = req.body;
        const newDemandList = new DemandList({
            PersonId,
            Need,
            Reason,
            isApproved
        });

        const savedDemandList = await newDemandList.save();
        res.status(201).json(savedDemandList);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while creating the demand list.' });
    }
});


module.exports = router;