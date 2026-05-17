import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminRegister from './pages/AdminRegister'
import Scan from './pages/Scan'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import { useAuth } from './context/AuthContext'
import { Navigate } from 'react-router-dom'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/"               element={<Home />} />
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />
      <Route path="/admin-register" element={<AdminRegister />} />

      {/* Student only */}
      <Route path="/scan"      element={!user ? <Navigate to="/login" /> : user.role === 'student' ? <Scan />      : <Navigate to="/admin" />} />
      <Route path="/dashboard" element={!user ? <Navigate to="/login" /> : user.role === 'student' ? <Dashboard /> : <Navigate to="/admin" />} />

      {/* Admin only */}
      <Route path="/admin" element={!user ? <Navigate to="/login" /> : user.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App