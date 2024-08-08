const express = require('express')
const mongoose = require('mongoose')

const authRoute = require('./routes/auth');
const userProfile = require('./routes/userProfile')
const beneficiaryRoute = require('./routes/beneficiary')
const donorRoute = require('./routes/donor');
const extraexpendituresRoute = require('./routes/extraExpenditure');
const conversionRoute = require('./routes/conversion');
const demandListRoute = require('./routes/demandList');
const expensesRecordsRoute = require('./routes/expenseRecords');
const emailRoute = require('./routes/email');
const cron = require('node-cron');
const Account = require('./models/Account');
const scheduleJob = require('./middleware/scheduleJob')
const axios = require('axios');
const cors = require('cors');
const ExpenseRecord = require('./models/ExpenseRecord');
require('dotenv').config()

const app = express()

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.t1ompdc.mongodb.net/zakatWebsite`, { useNewUrlParser: true })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{
    console.log("MongoDB Connection Successfull");
    initializeAccount().catch(console.error);
    initializeExpenseRecords().catch(console.error);
});

app.use(express.json());

app.use(cors());

const initializeAccount = async () => {
    const accountCount = await Account.countDocuments();
    if (accountCount === 0) {
        const newAccount = new Account();
        await newAccount.save();
        console.log('Account initialized.');
    } else {
        console.log('Account already exists.');
    }
};

const initializeExpenseRecords = async () => {
    const records = await ExpenseRecord.countDocuments();
    if (records === 0) {
        const newRecord = new ExpenseRecord();
        await newRecord.save();
        console.log('Expense Record initialized.');
    } else {
        console.log('Expense Record already exists.');
    }
};

const visitWebsite = async () => {
    try {
        const response = await axios.get('https://zakatbackend.onrender.com/status');
    } catch (error) {
        console.error(`Error visiting the site: ${error.message}`);
    }
};

// Schedule the job to run every minute
cron.schedule('*/1 * * * *', visitWebsite);

cron.schedule('0 0 1 * *', () => {
    scheduleJob();
});

app.use('/', authRoute);
app.use('/', userProfile);
app.use('/', beneficiaryRoute);
app.use('/', donorRoute);
app.use('/', extraexpendituresRoute);
app.use('/', conversionRoute);
app.use('/', demandListRoute);
app.use('/', expensesRecordsRoute);
app.use('/', emailRoute);
app.get('/status', (req, res)=> {
    res.status(200).json({
        status: 'Up',
        frontend: process.env.FRONT_END_URL
    })
})

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`))