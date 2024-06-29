const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Donor = require("../models/Donor");
const z = require("zod");
const router = express.Router();

const donorSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    yearlyAmount: z.array(z.object({
        date: z.string().transform((str) => new Date(str)).refine((date) => !isNaN(date.getTime()), { message: 'Invalid date' }),
        amount: z.number().min(1, { message: 'Amount must be positive' }),
        type: z.enum(['Zakat', 'Sadqah', 'Fitra', 'Kherat']),
    })),
    contactNumber: z.string().min(1, { message: 'Contact number is required' })
});


router.get('/donors', auth, async (req, res) => {
    try {
        const donors = await Donor.find();
        donors.reverse();
        res.json(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to add a new donor
router.post('/donors/add', auth, admin, async (req, res) => {
    try {
        const result = donorSchema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const newDonor = new Donor(result.data);
        await newDonor.save();
    
        res.status(201).json({ message: 'Donor added successfully', donor: newDonor });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;