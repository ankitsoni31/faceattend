// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import Navbar from '../components/Navbar'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     rollNumber: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   })

//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirm, setShowConfirm] = useState(false)

//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       return
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters')
//       return
//     }

//     setLoading(true)

//     try {
//       await axios.post('https://faceattend-backend-kbrz.onrender.com/api/auth/register', {
//         name: formData.name,
//         rollNumber: formData.rollNumber,
//         email: formData.email,
//         password: formData.password
//       })

//       alert('✅ Registration successful!')
//       navigate('/login')

//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Eye icon component
//   const EyeIcon = ({ show }) => show ? (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
//       <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
//       <line x1="1" y1="1" x2="23" y2="23"/>
//     </svg>
//   ) : (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//       <circle cx="12" cy="12" r="3"/>
//     </svg>
//   )

//   return (
//     <div className="min-h-screen bg-[#04080F] text-white relative overflow-hidden">

//       <Navbar />

//       {/* Background */}
//       <div
//         className="fixed inset-0 opacity-25 pointer-events-none"
//         style={{
//           backgroundImage:
//             'linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)',
//           backgroundSize: '55px 55px'
//         }}
//       />

//       {/* Glow */}
//       <div className="fixed right-[-80px] bottom-[-80px] w-[220px] h-[220px] bg-green-400/10 blur-[100px] rounded-full" />

//       {/* Main */}
//       <div className="relative z-10 flex justify-center px-4 pt-20 pb-6">

//         <div className="w-full max-w-[430px]">

//           {/* Header */}
//           <div className="text-center mb-5">
//             <div className="w-11 h-11 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-3">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
//                 <circle cx="9" cy="7" r="4"/>
//                 <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
//               </svg>
//             </div>
//             <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
//               Create Account
//             </h1>
//             <p className="text-[#7C8DB5] text-xs mt-2">
//               Register to continue attendance system
//             </p>
//           </div>

//           {/* Card */}
//           <div className="bg-[#071225]/90 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">

//             {error && (
//               <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl px-3 py-2 mb-3">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-3">

//               {/* Full Name */}
//               <div>
//                 <label className="block text-xs text-[#8B9BC7] mb-1.5">Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter full name"
//                   required
//                   className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition-all"
//                 />
//               </div>

//               {/* Admission Number */}
//               <div>
//                 <label className="block text-xs text-[#8B9BC7] mb-1.5">Admission Number</label>
//                 <input
//                   type="text"
//                   name="rollNumber"
//                   value={formData.rollNumber}
//                   onChange={handleChange}
//                   placeholder="Enter admission number"
//                   required
//                   className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition-all"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-xs text-[#8B9BC7] mb-1.5">Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter email address"
//                   required
//                   className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition-all"
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-xs text-[#8B9BC7] mb-1.5">Password</label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Enter password"
//                     required
//                     className="w-full h-11 px-4 pr-12 bg-black/70 border border-white/10 rounded-2xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition-all"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
//                   >
//                     <EyeIcon show={showPassword} />
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className="block text-xs text-[#8B9BC7] mb-1.5">Confirm Password</label>
//                 <div className="relative">
//                   <input
//                     type={showConfirm ? 'text' : 'password'}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Confirm password"
//                     required
//                     className="w-full h-11 px-4 pr-12 bg-black/70 border border-white/10 rounded-2xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition-all"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirm(!showConfirm)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
//                   >
//                     <EyeIcon show={showConfirm} />
//                   </button>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full h-11 rounded-2xl text-sm font-semibold transition-all duration-300 ${
//                   loading
//                     ? 'bg-gray-600 cursor-not-allowed'
//                     : 'bg-[#00FF94] text-black hover:scale-[1.01]'
//                 }`}
//               >
//                 {loading ? 'Creating...' : 'Create Account'}
//               </button>

//             </form>

//             {/* Login Link */}
//             <div className="text-center mt-5 text-xs text-[#7C8DB5]">
//               Already have an account?{' '}
//               <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
//                 Login here
//               </Link>
//             </div>

//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Register












import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {

const navigate = useNavigate()

const [loading, setLoading] = useState(false)

const [formData, setFormData] = useState({
name: '',
rollNumber: '',
email: '',
password: '',
confirmPassword: '',


// NEW FIELDS
department: '',
year: '',
batch: ''


})

const handleChange = (e) => {

setFormData({
  ...formData,
  [e.target.name]: e.target.value
})


}

const handleSubmit = async (e) => {


e.preventDefault()

if (formData.password !== formData.confirmPassword) {
  return alert('Passwords do not match')
}

try {

  setLoading(true)

  await axios.post(
    'https://faceattend-backend-kbrz.onrender.com/api/auth/register',
    {
      name: formData.name,
      rollNumber: formData.rollNumber,
      email: formData.email,
      password: formData.password,

      // NEW FIELDS
      department: formData.department,
      year: formData.year,
      batch: formData.batch
    }
  )

  alert('✅ Registration successful')

  navigate('/login')

} catch (err) {

  console.log(err)

  alert(
    err.response?.data?.message ||
    'Registration failed'
  )

} finally {

  setLoading(false)
}


}

return (


<div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

  <div className="w-full max-w-md bg-[#071028] border border-white/10 rounded-3xl p-6 sm:p-8">

    <h1 className="text-3xl font-bold text-center mb-2">
      Create Account
    </h1>

    <p className="text-center text-gray-400 text-sm mb-8">
      Register to continue
    </p>

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* Name */}
      <div>

        <label className="block text-xs text-[#8B9BC7] mb-1.5">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your name"
          className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm outline-none focus:border-cyan-400"
        />

      </div>

      {/* Roll Number */}
      <div>

        <label className="block text-xs text-[#8B9BC7] mb-1.5">
          Roll Number
        </label>

        <input
          type="text"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          required
          placeholder="Enter roll number"
          className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm outline-none focus:border-cyan-400"
        />

      </div>

      {/* Email */}
      <div>

        <label className="block text-xs text-[#8B9BC7] mb-1.5">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter email"
          className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm outline-none focus:border-cyan-400"
        />

      </div>

      {/* Department */}
      <div>

        <label className="block text-xs text-[#8B9BC7] mb-1.5">
          Department
        </label>

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm outline-none focus:border-cyan-400"
        >
          <option value="">Select Department</option>
          <option value="BSc IT">BSc IT</option>
          <option value="BCom">BCom</option>
          <option value="CS">CS</option>
        </select>

      </div>

      {/* Year */}
      <div>

        <label className="block text-xs text-[#8B9BC7] mb-1.5">
          Year
        </label>

        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm outline-none focus:border-cyan-400"
        >
          <option value="">Select Year</option>
          <option value="FY">FY</option>
          <option value="SY">SY</option>
          <option value="TY">TY</option>
        </select>

      </div>

      {/* Batch */}
      <div>

        <label className="block text-xs text-[#8B9BC7] mb-1.5">
          Batch
        </label>

        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm outline-none focus:border-cyan-400"
        >
          <option value="">Select Batch</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>

      </div>

      {/* Password */}
      <div>

        <label className="block text-xs text-[#8B9BC7] mb-1.5">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter password"
          className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm outline-none focus:border-cyan-400"
        />

      </div>

      {/* Confirm Password */}
      <div>

        <label className="block text-xs text-[#8B9BC7] mb-1.5">
          Confirm Password
        </label>

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm password"
          className="w-full h-11 px-4 bg-black/70 border border-white/10 rounded-2xl text-sm outline-none focus:border-cyan-400"
        />

      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-2xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition"
      >
        {
          loading
            ? 'Creating Account...'
            : 'Register'
        }
      </button>

    </form>

    <p className="text-center text-sm text-gray-400 mt-6">

      Already have an account?

      <Link
        to="/login"
        className="text-cyan-400 ml-1 hover:underline"
      >
        Login
      </Link>

    </p>

  </div>

</div>


)
}

export default Register
