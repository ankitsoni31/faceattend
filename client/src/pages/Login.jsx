import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Login = () => {
  const [formData, setFormData] = useState({
    rollNumber: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(
        'https://faceattend-backend.onrender.com/api/auth/login',
        formData
      )

      login(res.data.user, res.data.token)

      if (res.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }

    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#04080F] min-h-screen text-white overflow-hidden">

      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(0,200,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Glow */}
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.055] blur-[140px] pointer-events-none z-0" />

      {/* Main */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 pb-10">

        <div className="w-full max-w-[430px]">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                <path d="M10 17l5-5-5-5"/>
                <path d="M3 12h12"/>
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">
              Login to mark your attendance
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#0A1221] border border-cyan-500/10 rounded-3xl p-5 backdrop-blur-xl">

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 mb-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ID / Admission Number */}
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">
                  ID / Admission Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="ID / Admission Number"
                  required
                  className="w-full h-11 px-4 text-sm bg-[#04080F] border border-white/10 rounded-2xl text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Password with eye toggle */}
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="w-full h-11 px-4 pr-12 text-sm bg-[#04080F] border border-white/10 rounded-2xl text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      // Eye Off
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      // Eye
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-11 text-sm font-semibold rounded-2xl transition-all ${
                  loading
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-cyan-400 hover:opacity-90 hover:scale-[1.01]'
                } text-[#04080F]`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

            </form>

            {/* Register Link */}
            <div className="text-center mt-5 text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:underline font-medium">
                Register here
              </Link>
            </div>

            {/* Admin Register Link */}
            <div className="text-center mt-3 text-xs text-slate-600">
              Admin?{' '}
              <Link to="/admin-register" className="text-amber-400 hover:underline font-medium">
                Register as Admin
              </Link>
            </div>

          </div>

          {/* Bottom */}
          <div className="text-center mt-5 text-xs text-slate-500">
            🔒 Secure login with JWT authentication
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login