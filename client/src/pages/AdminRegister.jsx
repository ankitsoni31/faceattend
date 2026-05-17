import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretCode: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await axios.post('https://faceattend-backend-kbrz.onrender.com/api/auth/register-admin', {
        name: formData.name,
        rollNumber: formData.rollNumber,
        email: formData.email,
        password: formData.password,
        secretCode: formData.secretCode
      })
      alert('✅ Admin account created! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  // Eye icon
  const EyeIcon = ({ show }) => show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

  return (
    <div className="bg-[#04080F] min-h-screen text-white">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(0,200,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="fixed top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-10">

        {/* max-w-md → max-w-lg se thoda wide kiya */}
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F0DB4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Admin Register</h1>
            <p className="text-slate-400 text-sm">Only authorized personnel can register as admin</p>
          </div>

          {/* Warning */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-amber-400 text-sm font-semibold">Admin Access Only</p>
              <p className="text-slate-400 text-xs mt-1">You need the secret admin code to register. Contact the system administrator.</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#0A1221] border border-amber-500/10 rounded-2xl p-8">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-5 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Name + Employee ID — side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-3 text-sm bg-[#04080F] border border-white/10 rounded-lg text-white outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-medium">Employee / Teacher ID</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. TCH001"
                    required
                    className="w-full px-4 py-3 text-sm bg-[#04080F] border border-white/10 rounded-lg text-white outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-4 py-3 text-sm bg-[#04080F] border border-white/10 rounded-lg text-white outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Password + Confirm — side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                {/* Password */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      required
                      className="w-full px-4 py-3 pr-11 text-sm bg-[#04080F] border border-white/10 rounded-lg text-white outline-none focus:border-amber-500/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2 font-medium">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                      className="w-full px-4 py-3 pr-11 text-sm bg-[#04080F] border border-white/10 rounded-lg text-white outline-none focus:border-amber-500/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <EyeIcon show={showConfirm} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Secret Code */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2 font-medium">
                  Secret Admin Code
                  <span className="ml-2 text-xs text-amber-400">🔑 Required</span>
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    name="secretCode"
                    value={formData.secretCode}
                    onChange={handleChange}
                    placeholder="Enter secret code"
                    required
                    className="w-full px-4 py-3 pr-11 text-sm bg-[#04080F] border border-amber-500/20 rounded-lg text-white outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <EyeIcon show={showSecret} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Contact system administrator for the secret code</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 text-sm font-semibold rounded-lg transition-all ${
                  loading
                    ? 'bg-slate-600 cursor-not-allowed text-slate-300'
                    : 'bg-amber-400 hover:opacity-90 text-[#04080F] cursor-pointer'
                }`}
              >
                {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </button>
            </form>

            <div className="text-center mt-5 text-sm text-slate-400">
              Normal student?{' '}
              <Link to="/register" className="text-cyan-400 hover:underline font-medium">
                Register here
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminRegister