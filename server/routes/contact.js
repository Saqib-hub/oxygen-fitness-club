const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    // 1. Database me save karo
    const contact = new Contact(req.body);
    await contact.save();

    // 2. Email bhejo (agar credentials hain)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
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
        subject: `🔥 New Message from ${req.body.name} - Oxygen Fitness Club`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #fff; padding: 30px; border-radius: 10px;">
            <h1 style="color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 15px;">
              New Contact Form Submission
            </h1>
            <p style="margin: 20px 0;"><strong style="color: #e50914;">Name:</strong> ${req.body.name}</p>
            <p style="margin: 20px 0;"><strong style="color: #e50914;">Email:</strong> ${req.body.email}</p>
            <p style="margin: 20px 0;"><strong style="color: #e50914;">Message:</strong></p>
            <div style="background: #1a1a1a; padding: 20px; border-left: 4px solid #e50914; border-radius: 5px;">
              ${req.body.message}
            </div>
            <hr style="border: 1px solid #333; margin: 30px 0;">
            <p style="color: #aaa; font-size: 12px;">Received: ${new Date().toLocaleString()}</p>
            <p style="color: #aaa; font-size: 12px;">Oxygen Fitness Club - Contact Form</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent to admin');
      } catch (emailErr) {
        console.error('⚠️ Email Error:', emailErr.message);
        // Email fail ho gaya lekin database me save ho gaya
      }
    } else {
      console.log('⚠️ Email credentials missing in .env');
    }

    res.json({
      success: true,
      message: '✅ Message Sent! We will contact you soon.'
    });
  } catch (err) {
    console.error('Contact Error:', err.message);
    res.json({
      success: false,
      message: '❌ Failed to send message. Please try again.'
    });
  }
});

module.exports = router;