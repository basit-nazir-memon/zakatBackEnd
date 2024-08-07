const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getResetEmail = require('../emailTemplates/resetPassword');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


router.post('/reset-password', [
    check('email').isEmail().withMessage('Please enter a valid email address'),
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0] });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'No account with that email found' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetUrl = `${process.env.FRONT_END_URL}/auth/reset-password/${token}`;

        const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset',
        html: getResetEmail(resetUrl, user.firstName, user.lastName)
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Route to handle password reset
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body; // Get the token and password from the request body

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Validate the password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!newPassword.match(passwordRegex)) {
        return res.status(400).json({
            error: 'Password should have one lowercase letter, one uppercase letter, one special character, one number, and be at least 8 characters long',
        });
    }

    try {
        // Find the user by ID
        let user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        // Check if user exists and token is valid
        if (!user) {
            return res.status(400).json({ error: 'Invalid token or token has expired' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear the reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Save the user
        await user.save();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Has Been Updated',
            text: `Dear User, your password has been updated. If you did not request this, please reset your password now.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while updating the password' });
    }
});


module.exports = router;
