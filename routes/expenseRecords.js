const express = require("express");
const auth = require("../middleware/auth");
const Account = require("../models/Account");
const ExpenseRecord = require("../models/ExpenseRecord");
const router = express.Router();

router.get('/summary', async (req, res) => {
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
        const currentYearData = expenseRecord.years.find(year => year.year === currentYear);

        let currentMonthTotalExpenses = 0;
        // if (!currentYearData) {
        //     return res.status(404).json({ message: 'Current year data not found' });
        // }

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

        // Ensure both series have 12 data points (months)
        while (chartSeries[0].data.length < 12) chartSeries[0].data.push(0);
        while (chartSeries[1].data.length < 12) chartSeries[1].data.push(0);

        // Populate data for the current year
        if (currentYearData){
            for (let month in currentYearData.months) {
                chartSeries[0].data.push(currentYearData.months[month].amount || 0);
            }    
        }

        // Find previous year data and populate if exists
        const lastYearData = expenseRecord.years.find(year => year.year === currentYear - 1);
        if (lastYearData) {
            for (let month in lastYearData.months) {
                chartSeries[1].data.push(lastYearData.months[month].amount || 0);
            }
        }

        res.json({
            totalAmountUSD,
            totalAmountPKR,
            currentMonthTotalExpenses,
            expenseHistory: chartSeries
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;