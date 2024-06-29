const Account = require("../models/Account");
const Beneficiary = require("../models/Beneficiary");
const addExpenseEntry = require("./addRecord");

async function scheduleJob() {
    try {
        const beneficiaries = await Beneficiary.find();

        if (!beneficiaries || beneficiaries.length === 0) {
            console.log('Schedule Job - No beneficiaries found');
            return;
        }

        const account = await Account.findOne();

        if (!account) {
            console.log('Schedule Job - Account not found');
            return;
        }

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.toLocaleString('default', { month: 'short' });

        for (let b of beneficiaries) {
            const currentTerm = b.currentTerm - 1;

            if (b.isAlive && currentTerm >= 0 && b.Term[currentTerm] && !b.Term[currentTerm].isClosed) {
                const monthlyAmount = b.Term[currentTerm].amountTerms.reduce((sum, term) => sum + term.amountChange, 0);

                if (
                    (b.Term[currentTerm].type === "Monthly") || 
                    (b.Term[currentTerm].type === "Yearly" && new Date(b.Term[currentTerm].startDate).getMonth() === today.getMonth())
                ) {
                    await account.logTransaction(
                        -1 * monthlyAmount,
                        "PKR",
                        "Beneficiary Expense",
                        `An Amount of ${monthlyAmount}PKR has been deducted by System for the Beneficiary Expense on ${today} for the beneficiary named ${b.name} against Term Number: '${currentTerm}'`
                    );

                    await addExpenseEntry(
                        currentYear,
                        currentMonth,
                        monthlyAmount,
                        `An Amount of ${monthlyAmount}PKR has been deducted by System for the Beneficiary Expense on ${today} for the beneficiary named ${b.name} against Term Number: '${currentTerm}'`
                    );
                }
            }
        }
    } catch (error) {
        console.error('Error in scheduleJob:', error);
    }
}

module.exports = scheduleJob;
