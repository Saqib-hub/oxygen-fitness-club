const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Member = require('../models/Member');

// GET all contacts
router.get('/admin/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// GET all members
router.get('/admin/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ joinedAt: -1 });
    res.json({ success: true, members });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// DELETE contact
router.delete('/admin/contact/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// DELETE member
router.delete('/admin/member/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Member deleted' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;