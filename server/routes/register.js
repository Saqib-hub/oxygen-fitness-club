const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const nodemailer = require('nodemailer');

router.post('/register', async (req, res) => {
  try {
    // 1. Database me save karo
    const member = new Member(req.body);
    await member.save();
    console.log('✅ New Member registered');

    // 2. Email bhejo (function ke andar transporter banao)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `🏋️ New Member Registered - ${req.body.name}`,
          html: `
            <div style="font-family: Arial; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #fff; padding: 30px; border-radius: 10px;">
              <h1 style="color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 15px;">
                New Gym Member Registration
              </h1>
              <p style="margin: 15px 0;"><strong style="color: #e50914;">Name:</strong> ${req.body.name}</p>
              <p style="margin: 15px 0;"><strong style="color: #e50914;">Email:</strong> ${req.body.email}</p>
              <p style="margin: 15px 0;"><strong style="color: #e50914;">Phone:</strong> ${req.body.phone}</p>
              <p style="margin: 15px 0;"><strong style="color: #e50914;">Age:</strong> ${req.body.age}</p>
              <p style="margin: 15px 0;"><strong style="color: #e50914;">Plan:</strong> ${req.body.plan}</p>
              <p style="margin: 15px 0;"><strong style="color: #e50914;">Address:</strong> ${req.body.address}</p>
              
              <hr style="border: 1px solid #333; margin: 30px 0;">
              <p style="color: #aaa; font-size: 12px;">Registered: ${new Date().toLocaleString()}</p>
              <p style="color: #aaa; font-size: 12px;">Oxygen Fitness Club - New Member</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Member Email sent to admin');
      } catch (emailErr) {
        console.error('⚠️ Member Email Error:', emailErr.message);
      }
    }

    res.json({
      success: true,
      message: '✅ Registration Successful! Welcome to Oxygen Fitness Club.'
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.json({
      success: false,
      message: '❌ Registration Failed. Please try again.'
    });
  }
});

module.exports = router;