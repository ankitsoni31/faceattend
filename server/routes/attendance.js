const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// ── MARK ATTENDANCE
router.post('/mark', async (req, res) => {
  try {
    const { studentId, subject, confidence } = req.body;

    const now = new Date();
    const date = now.toISOString().split('T')[0]; // "2026-05-14"
    const time = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Duplicate check (same student, subject, date)
    const existing = await Attendance.findOne({ 
      student: studentId, subject, date 
    });
    if (existing) {
      return res.status(400).json({ 
        message: 'Attendance already marked for today' 
      });
    }

    const attendance = new Attendance({
      student: studentId,
      subject,
      date,
      time,
      status: 'present',
      confidence
    });

    await attendance.save();

    res.status(201).json({ 
      message: '✅ Attendance marked!', 
      attendance 
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// ── GET STUDENT ATTENDANCE
router.get('/student/:studentId', async (req, res) => {
  try {
    const records = await Attendance.find({ 
      student: req.params.studentId 
    }).sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// ── GET ALL ATTENDANCE (Admin)
router.get('/all', async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('student', 'name rollNumber')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

// ── GET ATTENDANCE % PER SUBJECT
router.get('/stats/:studentId', async (req, res) => {
  try {
    const records = await Attendance.find({ 
      student: req.params.studentId 
    });

    // Group by subject
    const stats = {};
    records.forEach(r => {
      if (!stats[r.subject]) {
        stats[r.subject] = { present: 0, total: 0 };
      }
      stats[r.subject].total++;
      if (r.status === 'present') stats[r.subject].present++;
    });

    // Calculate percentage
    const result = Object.keys(stats).map(subject => ({
      subject,
      present: stats[subject].present,
      total: stats[subject].total,
      percentage: Math.round(
        (stats[subject].present / stats[subject].total) * 100
      )
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
});

module.exports = router;