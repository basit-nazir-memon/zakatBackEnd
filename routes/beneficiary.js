const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Beneficiary = require("../models/Beneficiary");
const router = express.Router();

router.get('/beneficiaries', async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find({}, '_id name CNIC gender isAlive City Area');
        res.json(beneficiaries);
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/beneficiaries/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const beneficiary = await Beneficiary.findById(id);
        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }
        res.json(beneficiary);
    } catch (error) {
        console.error('Error fetching beneficiary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/beneficiaries/add', async (req, res) => {
    try {
        const beneficiaryData = req.body;

        // Create a new Beneficiary document
        const newBeneficiary = new Beneficiary(beneficiaryData);

        if (newBeneficiary.Term && newBeneficiary.Term[0]?.type == "Occasionally"){
            newBeneficiary.Term = [];
            newBeneficiary.currentTerm = -1;

            if(newBeneficiary.extraFA[0]?.amount <= 0){
                return res.status(500).json({ msg: 'Financial Assistance Amount Should be greater than zero', error: "Error" });
            }
            if(newBeneficiary.extraFA[0]?.reason == ''){
                return res.status(500).json({ msg: 'Financial Assistance Must Include the Reason', error: "Error" });
            }

        }else{
            newBeneficiary.extraFA = [];

            if(newBeneficiary.Term[0]?.amountTerms[0].amount <= 0){
                return res.status(500).json({ msg: 'Amount Should be greater than zero', error: "Error" });
            }

            if(newBeneficiary.Term[0]?.amountTerms[0].reason == ''){
                return res.status(500).json({ msg: 'Enter the Amount Change Reason', error: "Error" });
            }
        }

        newBeneficiary.isAlive = true;

        // Save the document to the database
        await newBeneficiary.save();

        res.status(201).json({ msg: 'Beneficiary added successfully!', beneficiary: newBeneficiary });
    } catch (error) {
        console.error('Error adding beneficiary:', error);
        res.status(500).json({ msg: 'Registration failed', error: error.message });
    }
});

router.get('/monthly-expenses', async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find();

        const monthlyExpenses = beneficiaries.map(beneficiary => {
            if (!beneficiary.isAlive) {
                return {
                    id: beneficiary._id,
                    name: beneficiary.name,
                    cnic: beneficiary.CNIC,
                    contact: beneficiary.ContactNumber,
                    city: beneficiary.City,
                    area: beneficiary.Area,
                    monthlyExpense: 0
                };
            }

            const currentTerm = beneficiary.Term[beneficiary.currentTerm - 1];

            if (!currentTerm || currentTerm.endDate !== null) {
                return {
                    id: beneficiary._id,
                    name: beneficiary.name,
                    cnic: beneficiary.CNIC,
                    contact: beneficiary.ContactNumber,
                    city: beneficiary.City,
                    area: beneficiary.Area,
                    monthlyExpense: 0
                };
            }

            const monthlyExpense = currentTerm.amountTerms.reduce((sum, term) => sum + term.amountChange, 0);

            return {
                id: beneficiary._id,
                name: beneficiary.name,
                cnic: beneficiary.CNIC,
                contact: beneficiary.ContactNumber,
                city: beneficiary.City,
                area: beneficiary.Area,
                monthlyExpense
            };
        });

        res.status(200).json(monthlyExpenses);
    } catch (error) {
        console.error('Error fetching monthly expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;