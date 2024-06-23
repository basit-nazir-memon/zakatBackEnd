const express = require('express')
const mongoose = require('mongoose')
const nodemon = require('nodemon')
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');
const blogPostRoute = require('./routes/blogPost');
const searchRoute = require('./routes/search');
const UserInteractionRoute = require('./routes/userInteraction');
const worksRoute = require('./routes/works')
const userProfile = require('./routes/userProfile')
const orderRoute = require('./routes/order')
const beneficiaryRoute = require('./routes/beneficiary')
const donorRoute = require('./routes/donor');
const extraexpendituresRoute = require('./routes/extraExpenditure');
const conversionRoute = require('./routes/conversion');
const demandListRoute = require('./routes/demandList');

const cors = require('cors');
require('dotenv').config()

const app = express()

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.t1ompdc.mongodb.net/zakatWebsite`, { useNewUrlParser: true })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{console.log("MongoDB Connection Successfull")});

app.use(express.json());

app.use(cors());

app.use('/', authRoute);
app.use('/', userProfile);
app.use('/', beneficiaryRoute);
app.use('/', donorRoute);
app.use('/', extraexpendituresRoute);
app.use('/', conversionRoute);
app.use('/', demandListRoute);

// app.use('/admin', adminRoute);
// app.use('/posts', blogPostRoute);
// app.use('/search', searchRoute);
// app.use('/works', worksRoute);
// app.use('/orders', orderRoute);
// app.use('/profile', userProfile);

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`))