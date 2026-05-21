// // server/routes/subjects.js

// const express = require('express')
// const router = express.Router()
// const Subject = require('../models/Subject')

// // GET ALL SUBJECTS
// router.get('/', async (req, res) => {
//   try {
//     const subjects = await Subject.find().sort({ createdAt: 1 })
//     res.json(subjects)
//   } catch (err) {
//     res.status(500).json({ message: '❌ Server error', error: err.message })
//   }
// })

// // ADD SUBJECT
// router.post('/add', async (req, res) => {
//   try {
//     const { name, code, time } = req.body

//     const existing = await Subject.findOne({ code })
//     if (existing) {
//       return res.status(400).json({ message: 'Subject with this code already exists' })
//     }

//     const subject = new Subject({ name, code, time })
//     await subject.save()

//     res.status(201).json({ message: '✅ Subject added!', subject })
//   } catch (err) {
//     res.status(500).json({ message: '❌ Server error', error: err.message })
//   }
// })

// // DELETE SUBJECT
// router.delete('/:id', async (req, res) => {
//   try {
//     await Subject.findByIdAndDelete(req.params.id)
//     res.json({ message: '✅ Subject deleted!' })
//   } catch (err) {
//     res.status(500).json({ message: '❌ Server error', error: err.message })
//   }
// })

// module.exports = router




// ADD SUBJECT
router.post('/add', async (req, res) => {

try {


const {
  name,
  code,
  time,
  startTime,
  endTime
} = req.body

const existing =
  await Subject.findOne({ code })

if (existing) {

  return res.status(400).json({
    message:
      'Subject with this code already exists'
  })
}

const subject = new Subject({

  name,

  code,

  time,

  startTime,

  endTime
})

await subject.save()

res.status(201).json({

  message: '✅ Subject added!',

  subject
})


} catch (err) {


res.status(500).json({

  message: '❌ Server error',

  error: err.message
})


}
})
