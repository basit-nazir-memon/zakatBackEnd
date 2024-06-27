const express = require("express");
const auth = require("../middleware/auth");
const Account = require("../models/Account");
const ExpenseRecord = require("../models/ExpenseRecord");
const Beneficiary = require("../models/Beneficiary");
const editor = require("../middleware/editor");
const router = express.Router();

router.get('/summary', auth, async (req, res) => {
    try {
        // Fetch the account data
        const account = await Account.findOne({});
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const totalAmountUSD = account.totalAmountUSD;
        const totalAmountPKR = account.totalAmountPKR;

        // Fetch the expense record data
        const expenseRecord = await ExpenseRecord.findOne({});
        if (!expenseRecord) {
            return res.status(404).json({ message: 'Expense record not found' });
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.toLocaleString('default', { month: 'short' });

        // Find current year data
        const currentYearData = expenseRecord.years.find(y => y.year === currentYear)?.toObject();

        let currentMonthTotalExpenses = 0;

        // Calculate current month total expenses
        if (currentYearData){
            const currentMonthData = currentYearData.months[currentMonth] || { amount: 0 };
            currentMonthTotalExpenses = currentMonthData.amount;
        }
        
        // Prepare expense history data for chart
        const chartSeries = [
            { name: 'This year', data: [] },
            { name: 'Last year', data: [] }
        ];

        if (currentYearData) {
            for (let month in currentYearData.months) {
                if (currentYearData.months.hasOwnProperty(month)) {
                    chartSeries[0].data.push(currentYearData.months[month].amount || 0);
                }
            }
        }

        // Find previous year data and populate if exists
        const lastYearData = expenseRecord.years.find(year => year.year === currentYear - 1)?.toObject();

        if (lastYearData) {
            for (let month in lastYearData.months) {
                if (lastYearData.months.hasOwnProperty(month)) {
                    chartSeries[1].data.push(lastYearData.months[month].amount || 0);
                }
            }
        }

        //  Ensure both series have 12 data points (months)
        while (chartSeries[0].data.length < 12) chartSeries[0].data.push(0);
        while (chartSeries[1].data.length < 12) chartSeries[1].data.push(0);

        const beneficiaries = await Beneficiary.find();
    
        const monthlyExpenses = beneficiaries.map(beneficiary => {
            const currentTerm = beneficiary.Term[beneficiary.currentTerm - 1];

            if (!beneficiary.isAlive || !currentTerm || currentTerm.endDate !== null) {
                return {
                    monthlyExpense: 0
                };
            }

            const monthlyExpense = currentTerm.amountTerms.reduce((sum, term) => sum + term.amountChange, 0);

            return {
                monthlyExpense
            };
        });

        const sumExpense = monthlyExpenses.reduce((sum, term) => sum + term.monthlyExpense, 0);

        res.json({
            totalAmountUSD,
            totalAmountPKR,
            currentMonthTotalExpenses,
            expenseHistory: chartSeries,
            sumExpense
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



router.get('/expenses-summary', auth, async (req, res) => {
    try {
        const expenseRecords = await ExpenseRecord.find();
        if (!expenseRecords || expenseRecords.length === 0) {
            return res.status(404).json({ message: 'No expense records found' });
        }

        const expenseSummary = [];

        expenseRecords.forEach(record => {
            record.years.forEach(yearEntry => {
                for (let month in yearEntry.months) {
                    if (yearEntry.months.hasOwnProperty(month)) {
                        const monthData = yearEntry.months[month];
                        expenseSummary.push({
                            id: record._id,
                            year: yearEntry.year,
                            month,
                            amount: monthData.amount || 0
                        });
                    }
                }
            });
        });

        res.json(expenseSummary);
    } catch (error) {
        console.error('Error fetching expense summaries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/expense-history/:year/:month', auth, editor, async (req, res) => {
    try {
        const { year, month } = req.params;

        const record = await ExpenseRecord.findOne();

        if (!record) {
            return res.status(404).json({ message: 'Expense record not found' });
        }

        const yearEntry = record.years.find(y => y.year === parseInt(year, 10));

        if (!yearEntry) {
            return res.status(404).json({ message: `Year ${year} not found in the record` });
        }

        // Find the month entry
        const monthData = yearEntry.months[month];

        if (!monthData) {
            return res.status(404).json({ message: `Month ${month} not found in the record for year ${year}` });
        }

        // Send the month data as a response
        res.json({
            id: record._id,
            year: yearEntry.year,
            month,
            amount: monthData.amount,
            details: monthData.details
        });
    } catch (error) {
        console.error('Error fetching expense record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;