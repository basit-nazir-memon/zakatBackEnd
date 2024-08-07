const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/User"); 
const admin = require("../middleware/admin");
const nodemailer = require('nodemailer');
const getAccountBlockedHTML = require("../emailTemplates/accountBlocked");
const getAccountUnblockedHTML = require("../emailTemplates/accountUnblocked");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});


// Get my details
router.get("/user/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({msg: "No User"});
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.post("/user/:id", async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Update user information
// router.patch("/user/:id", async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   try {
//     const user = await User.findByIdAndUpdate(id, updates, { new: true });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Delete user by ID
// router.delete("/users/:id", auth, admin, async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.send(user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get user by ID
// router.get("/user/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }
//     console.log("in find user route");
//     res.json(user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });


// Get all users as JSON
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find();
    
    const usersWithoutPassword = users.map(user => {
      const { password, ...userData } = user.toObject();
      return userData;
    });

    usersWithoutPassword.reverse();

    res.send(usersWithoutPassword);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get('/profile', auth, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

router.put('/profile', auth, async (req, res) => {
  const { firstName, lastName, email, phone, city, country, gender } = req.body;

  if (firstName == "" || lastName == "" || email == "" || country == "" || city == "" || gender == ""){
      return res.status(400).json({ msg: 'Fill All Fields' });
  }

  try {
      let user = await User.findById(req.user.id);

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.gender = gender || user.gender;
      user.address = {
          city: city,
          country: country
      }
      user.phone = phone || user.phone

      await user.save();

      res.status(200).json({msg: 'Updated User'});
  } catch (err) {
      console.error(err.message);
      res.status(500).json({err: 'Server Error'});
  }

});


router.put('/toggle-block/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.blocked = !(user.blocked);

        await user.save();

        if (user.blocked){
          const mailOptions = {
              to: user.email,
              from: process.env.EMAIL_USER,
              subject: 'Account Has Been Blocked',
              html: getAccountBlockedHTML(user.firstName, user.lastName, 'nazirmemon66@yahoo.com')
          };

          await transporter.sendMail(mailOptions);

          res.json({ msg: 'User blocked successfully' });
        }else{

          const mailOptions = {
              to: user.email,
              from: process.env.EMAIL_USER,
              subject: 'Your Account Has been Unblocked',
              html: getAccountUnblockedHTML(user.firstName, user.lastName, 'nazirmemon66@yahoo.com')
          };

          await transporter.sendMail(mailOptions);

          res.json({ msg: 'User unblocked successfully' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
