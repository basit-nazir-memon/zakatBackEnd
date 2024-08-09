const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const editor = require("../middleware/editor");
const Beneficiary = require("../models/Beneficiary");
const { body, validationResult } = require('express-validator');
const Account = require("../models/Account");
const addExpenseEntry = require("../middleware/addRecord");
const router = express.Router();

router.get('/beneficiaries', auth, async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find({}, '_id name CNIC gender isAlive City Area');
        beneficiaries.reverse();
        res.json(beneficiaries);
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/beneficiaries/:id', auth, editor , async (req, res) => {
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


router.post('/beneficiaries/add', auth, admin, async (req, res) => {
    try {
        const beneficiaryData = req.body;

        const newBeneficiary = new Beneficiary(beneficiaryData);

        const checkOccasionallyCondition = newBeneficiary.Term && newBeneficiary.Term[0]?.type == "Occasionally";

        if (checkOccasionallyCondition){
            newBeneficiary.Term = [];
            newBeneficiary.currentTerm = 0;

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

        const account = await Account.findOne();

        if (!account) {
            return res.status(404).send({ error: 'Account not found' });
        }

        // Save the document to the database
        await newBeneficiary.save();

        if (checkOccasionallyCondition){
            // Removing the Amount From Account
            await account.logTransaction( -1 * newBeneficiary.extraFA[0].amount, "PKR", "Beneficiary Extra Financial Assistance", `An Amount of ${newBeneficiary.extraFA[0].amount}PKR has been deducted for the extra FA entry on ${(new Date()).toISOString()} for the beneficiary named ${newBeneficiary.name} due to the reason: ${newBeneficiary.extraFA[0].reason}`);
            
            const now = new Date(newBeneficiary.extraFA[0].date);
            const currentYear = now.getFullYear();
            const currentMonth = now.toLocaleString('default', { month: 'short' });
            addExpenseEntry(currentYear, currentMonth, newBeneficiary.extraFA[0].amount, `An Amount of ${newBeneficiary.extraFA[0].amount}PKR has been deducted for the extra FA entry on ${(new Date()).toISOString()} for the beneficiary named ${newBeneficiary.name} due to the reason: ${newBeneficiary.extraFA[0].reason}`);
        }else{
            const monthlyAmount = newBeneficiary.Term[0]?.amountTerms[0].amountChange;
            const reason = newBeneficiary.Term[0]?.amountTerms[0].reason;
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.toLocaleString('default', { month: 'short' });

            await account.logTransaction(
                -1 * monthlyAmount,
                "PKR",
                "Beneficiary Expense",
                `An Amount of ${monthlyAmount}PKR has been deducted for the Beneficiary Expense on ${(new Date()).toISOString()} for the beneficiary named ${newBeneficiary.name} against Term Number: '0' for the reason: ${reason}`
            );

            await addExpenseEntry(
                currentYear,
                currentMonth,
                monthlyAmount,
                `An Amount of ${monthlyAmount}PKR has been deducted for the Beneficiary Expense on ${(new Date()).toISOString()} for the beneficiary named ${newBeneficiary.name} against Term Number: '0' for the reason: ${reason}`
            );
        }

        res.status(201).json({ msg: 'Beneficiary added successfully!', beneficiary: newBeneficiary });
    } catch (error) {
        console.error('Error adding beneficiary:', error);
        res.status(500).json({ msg: 'Registration failed', error: error.message });
    }
});

router.get('/monthly-expenses', auth, async (req, res) => {
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
                    expense: 0,
                    type: 'None',
                    isPaid: false
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
                    expense: 0,
                    type: 'None',
                    isPaid: false
                };
            }

            const Expense = currentTerm.amountTerms.reduce((sum, term) => sum + term.amountChange, 0);

            const Type = currentTerm.type;

            // Get current date information
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            let isPaid = false;

             // Check payment based on term type
            if (Type === 'Monthly') {
                // Check if payment has been made this month
                isPaid = currentTerm.paymentHistory.some(payment => {
                    const paymentDate = new Date(payment.date);
                    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
                });
            } else if (Type === 'Yearly') {
                // Check if payment has been made this year
                isPaid = currentTerm.paymentHistory.some(payment => {
                    const paymentDate = new Date(payment.date);
                    return paymentDate.getFullYear() === currentYear;
                });
            }

            return {
                id: beneficiary._id,
                name: beneficiary.name,
                cnic: beneficiary.CNIC,
                contact: beneficiary.ContactNumber,
                city: beneficiary.City,
                area: beneficiary.Area,
                expense: Expense,
                type: Type,
                isPaid: isPaid
            };
        });

        res.status(200).json(monthlyExpenses);
    } catch (error) {
        console.error('Error fetching monthly expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/beneficiaries/personalInfo/:id', auth, admin, [
    body('name').notEmpty().withMessage('Name is required'),
    body('CNIC').optional().isString(),
    body('ContactNumber').optional().isString(),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('City').notEmpty().withMessage('City is required'),
    body('Area').notEmpty().withMessage('Area is required')
], async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const beneficiaryId = req.params.id;
        const updateData = {
            name: req.body.name,
            CNIC: req.body.CNIC,
            ContactNumber: req.body.ContactNumber,
            gender: req.body.gender,
            City: req.body.City,
            Area: req.body.Area
        };

        // Find and update the beneficiary
        const beneficiary = await Beneficiary.findByIdAndUpdate(beneficiaryId, updateData, { new: true, runValidators: true });

        if (!beneficiary) {
            return res.status(404).json({ msg: 'Beneficiary not found' });
        }

        res.json(beneficiary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.put('/beneficiaries/familyInfo/:id', auth, admin, [
    body('familyInfo.son').optional().isInt({ min: 0 }).withMessage('Number of sons must be a non-negative integer'),
    body('familyInfo.daughter').optional().isInt({ min: 0 }).withMessage('Number of daughters must be a non-negative integer'),
    body('familyInfo.adopted').optional().isInt({ min: 0 }).withMessage('Number of adopted children must be a non-negative integer')
], async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {
        const beneficiaryId = req.params.id;
        const updateData = {
            familyInfo : req.body.familyInfo
        };

        // Find and update the beneficiary
        const beneficiary = await Beneficiary.findByIdAndUpdate(beneficiaryId, { $set: updateData }, { new: true, runValidators: true });

        if (!beneficiary) {
            return res.status(404).json({ msg: 'Beneficiary not found' });
        }

        res.json({msg: "Updated"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.put('/beneficiaries/additionalInfo/:id', auth, admin, [
    body('isAlive').notEmpty().withMessage('Alive Status is required'),
    body('deathDate').optional(),
    body('profession').notEmpty().withMessage('Profession is required'),
    body('modeOfPayment').notEmpty().withMessage('Mode of Payment is required'),
    body('bank').optional().isString(),
    body('accountNumber').optional().isString(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    if (req.body.isAlive){
        req.body.deathDate = null;
    }else{
        if (req.body.deathDate == null){
            return res.status(400).json({ msg: 'Please Enter the Death Date' });
        }
    }

    try {
        const beneficiaryId = req.params.id;
        const updateData = {
            isAlive: req.body.isAlive,
            deathDate: req.body.deathDate,
            profession: req.body.profession,
            modeOfPayment: req.body.modeOfPayment,
            bank: req.body.bank,
            accountNumber: req.body.accountNumber
        };

        // Find and update the beneficiary
        const beneficiary = await Beneficiary.findByIdAndUpdate(beneficiaryId, updateData, { new: true, runValidators: true });

        if (!beneficiary) {
            return res.status(404).json({ msg: 'Beneficiary not found' });
        }

        res.json(beneficiary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/beneficiaries/extraFA/:id', auth, admin, async (req, res) => {
    try {
        const beneficiaryId = req.params.id;
        const { reason, amount, date, picProof } = req.body.extraFA;

        if (!reason || !amount || !date) {
            return res.status(400).json({ error: 'Reason, amount, and date are required fields' });
        }
    
        const beneficiary = await Beneficiary.findById(beneficiaryId);
    
        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }
    
        const newExtraFA = {
            reason,
            amount,
            date,
            picProof: picProof || [],
        };

        beneficiary.extraFA.push(newExtraFA);

        const account = await Account.findOne();

        if (!account) {
            return res.status(404).send({ error: 'Account not found' });
        }

        await beneficiary.save();

        await account.logTransaction( -1 * amount, "PKR", "Beneficiary Extra Financial Assistance", `An Amount of ${amount}PKR has been deducted for the extra FA entry on ${date} for the beneficiary named ${beneficiary.name} due to the reason: ${reason}`);

        const now = new Date(date);
        const currentYear = now.getFullYear();
        const currentMonth = now.toLocaleString('default', { month: 'short' });
        addExpenseEntry(currentYear, currentMonth, amount, `An Amount of ${amount}PKR has been deducted for the extra FA entry on ${date} for the beneficiary named ${beneficiary.name} due to the reason: ${reason}`);

        res.status(200).json({ message: 'ExtraFA added successfully', beneficiary });
    } catch (error) {
        console.error('Error adding extraFA:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/beneficiaries/amountterm/add/:id', auth, admin, async (req, res) => {
    const { id } = req.params;
    const { reason, amountChange } = req.body.amountTerms;

    if (!reason || amountChange === undefined) {
        return res.status(400).json({ error: 'Reason and amountChange are required' });
    }

    const account = await Account.findOne();

    if (!account) {
        return res.status(404).send({ error: 'Account not found' });
    }

    try {
        const beneficiary = await Beneficiary.findById(id);

        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        const currentTermIndex = beneficiary.currentTerm - 1;

        if (currentTermIndex === undefined || !beneficiary.Term[currentTermIndex]) {
            return res.status(400).json({ error: 'Current term is not properly set' });
        }

        const newAmountTerm = {
            reason,
            amountChange,
            date: new Date(),
        };

        beneficiary.Term[currentTermIndex].amountTerms.push(newAmountTerm);

        await beneficiary.save();

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.toLocaleString('default', { month: 'short' });

        await account.logTransaction(
            -1 * amountChange,
            "PKR",
            "Beneficiary New Amount Term Addition",
            `An Amount of ${amountChange}PKR has been ${amountChange > 0 ? 'Deducted' : 'Added'} for the beneficiary Expense Term due to New Amount Term Addition on ${(new Date()).toISOString()} for the beneficiary named ${beneficiary.name} against Term Number: ${currentTermIndex} for the reason: ${reason}`
        );

        await addExpenseEntry(
            currentYear,
            currentMonth,
            amountChange,
            `An Amount of ${amountChange}PKR has been ${amountChange > 0 ? 'Deducted' : 'Added'} for the beneficiary Expense Term due to New Amount Term Addition on ${(new Date()).toISOString()} for the beneficiary named ${beneficiary.name} against Term Number: ${currentTermIndex} for the reason: ${reason}`
        );

        res.status(200).json({ msg: 'Amount term added successfully'});
    } catch (error) {
        console.error('Error adding amount term:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/beneficiaries/term/close/:id', auth, admin, async (req, res) => {
    const { id } = req.params;

    try {
        const beneficiary = await Beneficiary.findById(id);

        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        const currentTermIndex = beneficiary.currentTerm - 1;

        if (currentTermIndex === undefined || !beneficiary.Term[currentTermIndex]) {
            return res.status(400).json({ error: 'Current term is not properly set' });
        }

        if (beneficiary.Term[currentTermIndex].isClosed === undefined || beneficiary.Term[currentTermIndex].isClosed == true){
            return res.status(400).json({error: 'The Term is Already Closed'});
        }

        beneficiary.Term[currentTermIndex].isClosed = true;
        beneficiary.Term[currentTermIndex].endDate = new Date();

        await beneficiary.save();

        res.status(200).json({ msg: 'Term Closed successfully'});
    } catch (error) {
        console.error('Error closing term:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/beneficiaries/term/add/:id', auth, admin, async (req, res) => {
    const { id } = req.params;
    const { status, type, amountTerms, closureReason, startDate, endDate } = req.body.Term;

    if (!status || !type) {
        return res.status(400).json({ error: 'Status and type are required' });
    }

    const account = await Account.findOne();

    if (!account) {
        return res.status(404).send({ error: 'Account not found' });
    }

    try {
        const beneficiary = await Beneficiary.findById(id);

        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        const newTerm = {
            status,
            type,
            amountTerms: amountTerms || [],
            closureReason: closureReason || '',
            startDate: startDate || new Date(),
            endDate: endDate || null
        };

        beneficiary.Term.push(newTerm);
        beneficiary.currentTerm = beneficiary.Term.length;

        await beneficiary.save();

        const monthlyAmount = newTerm?.amountTerms[0].amountChange;
        const reason = newTerm?.amountTerms[0].reason;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.toLocaleString('default', { month: 'short' });

        await account.logTransaction(
            -1 * monthlyAmount,
            "PKR",
            "Beneficiary New Term Addition",
            `An Amount of ${monthlyAmount}PKR has been deducted for the Beneficiary Expense on Addition of New Term on ${(new Date()).toISOString()} for the beneficiary named ${beneficiary.name} against Term Number: ${beneficiary.currentTerm} for the reason: ${reason}`
        );

        await addExpenseEntry(
            currentYear,
            currentMonth,
            monthlyAmount,
            `An Amount of ${monthlyAmount}PKR has been deducted for the Beneficiary Expense on Addition of New Term on ${(new Date()).toISOString()} for the beneficiary named ${beneficiary.name} against Term Number: ${beneficiary.currentTerm} for the reason: ${reason}`
        );

        res.status(200).json({ msg: 'Term added successfully', term: newTerm });
    } catch (error) {
        console.error('Error adding term:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/beneficiaries/pay', auth, admin, async (req, res) => {
    const { beneficiaryId } = req.body;

    try {
        const beneficiary = await Beneficiary.findById(beneficiaryId);

        if (!beneficiary) {
            console.log('No beneficiary found');
            return res.status(404).json({ error: "No beneficiary found" });
        }

        const account = await Account.findOne();

        if (!account) {
            console.log('Account not found');
            return res.status(404).json({ error: "Account not found" });
        }

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        const currentTerm = beneficiary.currentTerm - 1;

        if (beneficiary.isAlive && currentTerm >= 0 && beneficiary.Term[currentTerm] && !beneficiary.Term[currentTerm].isClosed) {
            const term = beneficiary.Term[currentTerm];
            const monthlyAmount = term.amountTerms.reduce((sum, term) => sum + term.amountChange, 0);

            let isPaid = false;

            if (term.type === "Monthly") {
                isPaid = term.paymentHistory.some(payment => {
                    const paymentDate = new Date(payment.date);
                    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
                });
            } else if (term.type === "Yearly") {
                isPaid = term.paymentHistory.some(payment => {
                    const paymentDate = new Date(payment.date);
                    return paymentDate.getFullYear() === currentYear;
                });
            }

            if (isPaid) {
                console.log('Payment for this period has already been made');
                return res.status(400).json({ error: "Payment for this period has already been made" });
            }

            // If not paid, proceed with the payment
            await account.logTransaction(
                -1 * monthlyAmount,
                "PKR",
                "Beneficiary Expense",
                `An amount of ${monthlyAmount} PKR has been deducted by System for the Beneficiary Expense on ${today} for the beneficiary named ${beneficiary.name} against Term Number: '${currentTerm + 1}'`
            );

            await addExpenseEntry(
                currentYear,
                today.toLocaleString('default', { month: 'short' }),
                monthlyAmount,
                `An amount of ${monthlyAmount} PKR has been deducted by System for the Beneficiary Expense on ${today} for the beneficiary named ${beneficiary.name} against Term Number: '${currentTerm + 1}'`
            );

            // Update the payment history
            term.paymentHistory.push({
                amountChange: monthlyAmount,
                date: today
            });

            await beneficiary.save();

            res.status(200).json({
                msg: "Payment Done Successfully"
            });
        } else {
            res.status(400).json({ error: "Invalid term or beneficiary status" });
        }
    } catch (error) {
        console.error('Error in processing payment:', error);
        res.status(500).json({ error: 'Error in Payment: ' + error });
    }
});


module.exports = router;