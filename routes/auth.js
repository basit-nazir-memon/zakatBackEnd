const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../middleware/admin');
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(), // or use multer.diskStorage() for disk storage
    limits: {
      fileSize: 5 * 1024 * 1024, // Adjust the file size limit as needed
    },
});
require('dotenv').config();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const getWelcomeEmail = require('../emailTemplates/welcome');
const passwordChange = require('../emailTemplates/passwordChangeConfirmation');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};

async function uploadFile(req) {
    let result = await streamUpload(req);
    return result;
}

router.post('/upload-avatar', auth, admin, upload.single('avatar'), async (req, res) => {
    try {
        const result = await uploadFile(req);

        res.status(200).json({ avatar: result.secure_url });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while uploading the avatar' });
    }
});

router.post('/upload-profilePic', auth, upload.single('avatar'), async (req, res) => {
    try {
        const result = await uploadFile(req);

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.avatar = result.secure_url;
        await user.save();

        res.status(200).json({ avatar: result.secure_url });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while uploading the avatar' });
    }
});


router.post('/register', auth, admin, async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password.match(passwordRegex)) {
            return res.status(400).json({
                msg: 'Password should have one lowercase letter, one uppercase letter, one special character, one number, and be at least 8 characters long',
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex)) {
            return res.status(400).json({ msg: 'Invalid email format' });
        }

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: 'Email is already in use' });
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: `Welcome to Imdaad Foundation Community`,
            html: getWelcomeEmail(user.firstName, user.lastName, process.env.FRONT_END_URL, password)
        };

        await transporter.sendMail(mailOptions);

        await user.save();

        res.status(200).json({ msg: 'User Registered Successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/update-password', auth, async (req, res) => {
    const { password, confirmPassword } = req.body;

    const _id = req.user.id;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.match(passwordRegex)) {
        return res.status(400).json({
            error: 'Password should have one lowercase letter, one uppercase letter, one special character, one number, and be at least 8 characters long',
        });
    }

    try {
        let user = await User.findOne({ _id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Changed',
            html: passwordChange(user.firstName, user.lastName, `${process.env.FRONT_END_URL}/auth/reset-password`)
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while updating the password' });
    }
});

router.post('/login', async (req, res) => {
    const token = req.header('Authorization');
    if (token) {
        return res.status(401).json({ msg: 'Already Logged In' });
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (user.blocked){
            return res.status(400).json({msg: 'Account Blocked'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" }, (err, token) => {
            if (err) throw err;
            res.json({ token, id: user.id, role: user.role, avatar: user.avatar, firstName: user.firstName,  lastName: user.lastName , email: user.email });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
