import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#04080F]/90 backdrop-blur-md border-b border-cyan-500/10">

        <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-white"
          >
            Face<span className="text-cyan-400">Attend</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">

            <Link
              to="/"
              className={`text-sm px-4 py-2 rounded-xl transition-all ${
                isActive('/')
                  ? 'text-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            {user && (
              <>
                {/* Sirf Student ko dikhao */}
                {user.role === 'student' && (
                  <>
                    <Link
                      to="/scan"
                      className={`text-sm px-4 py-2 rounded-xl transition-all ${
                        isActive('/scan')
                          ? 'text-cyan-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Scan
                    </Link>

                    <Link
                      to="/dashboard"
                      className={`text-sm px-4 py-2 rounded-xl transition-all ${
                        isActive('/dashboard')
                          ? 'text-cyan-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Dashboard
                    </Link>
                  </>
                )}

                {/* Sirf Admin ko dikhao */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`text-sm px-4 py-2 rounded-xl transition-all ${
                      isActive('/admin')
                        ? 'text-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">

            {user ? (
              <>
                <span className="text-sm text-white truncate max-w-[120px]">
                  👋 {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm px-4 py-2 rounded-xl border border-white/10 text-white hover:border-white/25 hover:bg-white/5 transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-sm px-5 py-2 rounded-xl bg-cyan-400 text-[#04080F] font-semibold hover:opacity-90 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-1.5"
          >
            <span className="w-6 h-[2px] bg-white rounded-full"></span>
            <span className="w-6 h-[2px] bg-white rounded-full"></span>
            <span className="w-6 h-[2px] bg-white rounded-full"></span>
          </button>

        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">

          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-5 text-white text-5xl leading-none"
          >
            ×
          </button>

          {/* Menu Content */}
          <div className="min-h-screen flex flex-col items-center gap-7 px-6 pt-28 pb-16">

            {/* Links */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`text-[30px] font-light transition-all ${
                isActive('/')
                  ? 'text-cyan-400'
                  : 'text-white hover:text-cyan-400'
              }`}
            >
              Home
            </Link>

            {user && (
              <>
                {/* Sirf Student ko dikhao */}
                {user.role === 'student' && (
                  <>
                    <Link
                      to="/scan"
                      onClick={() => setMenuOpen(false)}
                      className={`text-[30px] font-light transition-all ${
                        isActive('/scan')
                          ? 'text-cyan-400'
                          : 'text-white hover:text-cyan-400'
                      }`}
                    >
                      Scan
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className={`text-[30px] font-light transition-all ${
                        isActive('/dashboard')
                          ? 'text-cyan-400'
                          : 'text-white hover:text-cyan-400'
                      }`}
                    >
                      Dashboard
                    </Link>
                  </>
                )}

                {/* Sirf Admin ko dikhao */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className={`text-[30px] font-light transition-all ${
                      isActive('/admin')
                        ? 'text-cyan-400'
                        : 'text-white hover:text-cyan-400'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}

            {/* Bottom */}
            <div className="mt-3 flex flex-col items-center gap-4">

              {user ? (
                <>
                  <p className="text-white text-lg text-center break-all">
                    👋 {user.name}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="px-10 py-3 rounded-2xl bg-red-500 text-white text-sm font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-10 py-3 rounded-2xl border border-white/20 text-white text-sm font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="px-10 py-3 rounded-2xl bg-cyan-400 text-black text-sm font-semibold"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>

          </div>

        </div>
      )}
    </>
  )
}

export default Navbar