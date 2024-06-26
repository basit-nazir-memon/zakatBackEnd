const ExpenseRecord = require("../models/ExpenseRecord");

async function addExpenseEntry(year, month, amount, details) {
    try {
        // Find the single expense record document
        let record = await ExpenseRecord.findOne({});
        if (!record) {
            // Create a new record if it doesn't exist
            record = new ExpenseRecord({ years: [] });
        }

        // Find the year entry or create it if it doesn't exist
        let yearEntry = record.years.find(y => y.year === year);
        if (!yearEntry) {
            yearEntry = { year, months: {} };
            record.years.push(yearEntry);
        }

        // Add or update the month entry
        if (!yearEntry.months[month]) {
            yearEntry.months[month] = { amount: 0, details: [] };
        }
        yearEntry.months[month].amount += amount;
        yearEntry.months[month].details.push({ amount, details });

        // Save the record
        await record.save();
        console.log('Expense entry added successfully.');
    } catch (error) {
        console.error('Error adding expense entry:', error);
    }
}

module.exports = addExpenseEntry;