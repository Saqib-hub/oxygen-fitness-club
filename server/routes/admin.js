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
    console.error('Admin contacts error:', err.message);
    res.status(Contact.db.readyState === 1 ? 500 : 503).json({
      success: false,
      message: 'Unable to load contacts right now.'
    });
  }
});

// GET all members
router.get('/admin/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ joinedAt: -1 });
    res.json({ success: true, members });
  } catch (err) {
    console.error('Admin members error:', err.message);
    res.status(Member.db.readyState === 1 ? 500 : 503).json({
      success: false,
      message: 'Unable to load members right now.'
    });
  }
});

// DELETE contact
router.delete('/admin/contact/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    console.error('Admin contact delete error:', err.message);
    res.status(Contact.db.readyState === 1 ? 500 : 503).json({
      success: false,
      message: 'Unable to delete this contact right now.'
    });
  }
});

// DELETE member
router.delete('/admin/member/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Member deleted' });
  } catch (err) {
    console.error('Admin member delete error:', err.message);
    res.status(Member.db.readyState === 1 ? 500 : 503).json({
      success: false,
      message: 'Unable to delete this member right now.'
    });
  }
});

module.exports = router;