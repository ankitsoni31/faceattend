const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

// ── REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, rollNumber, email, password, role } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      rollNumber,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    await user.save();
    res.status(201).json({ message: '✅ Registered successfully' });

  } catch (err) {
    console.log('REGISTER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── LOGIN
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    const user = await User.findOne({ rollNumber });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        role: user.role,
        faceDescriptor: user.faceDescriptor
      }
    });

  } catch (err) {
    console.log('LOGIN ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── SAVE FACE DESCRIPTOR
router.post('/save-face', async (req, res) => {
  try {
    const { rollNumber, faceDescriptor } = req.body;

    await User.findOneAndUpdate(
      { rollNumber },
      { faceDescriptor }
    );

    res.json({ message: '✅ Face saved successfully' });

  } catch (err) {
    console.log('SAVE FACE ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── GET ALL STUDENTS
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(
      { role: 'student' },
      {
        name: 1,
        rollNumber: 1,
        email: 1,          // ← email add kiya
        faceDescriptor: 1
      }
    );

    res.json(users);

  } catch (err) {
    console.log('GET USERS ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE STUDENT (Admin only)
router.delete('/delete-student/:id', async (req, res) => {
  try {
    const studentId = req.params.id

    // Student exist karta hai?
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Student ki saari attendance bhi delete karo
    await Attendance.deleteMany({ student: studentId })

    // Student delete karo
    await User.findByIdAndDelete(studentId)

    res.json({ message: `✅ ${student.name} deleted successfully` })

  } catch (err) {
    console.log('DELETE STUDENT ERROR:', err)
    res.status(500).json({ message: err.message })
  }
})

// ── ADMIN REGISTER
router.post('/register-admin', async (req, res) => {
  try {
    const { name, rollNumber, email, password, secretCode } = req.body

    if (secretCode !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: '❌ Invalid secret code' })
    }

    const existing = await User.findOne({
      $or: [{ email }, { rollNumber }]
    })

    if (existing) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      rollNumber,
      email,
      password: hashedPassword,
      role: 'admin'
    })

    await user.save()
    res.status(201).json({ message: '✅ Admin registered successfully' })

  } catch (err) {
    res.status(500).json({ message: '❌ Server error', error: err.message })
  }
})

module.exports = router;






