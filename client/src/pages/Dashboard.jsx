import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import FaceRegister from '../components/FaceRegister'

const Dashboard = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [records, setRecords] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [recRes, statRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/attendance/student/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/attendance/stats/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ])
      setRecords(recRes.data)
      setStats(statRes.data)
    } catch (err) {
      console.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const totalPresent = records.filter(r => r.status === 'present').length
  const overallPct = records.length > 0 ? Math.round((totalPresent / records.length) * 100) : 0

  const getStatusColor = (pct) => {
    if (pct >= 75) return '#00FF94'
    if (pct >= 60) return '#F0DB4F'
    return '#FF4444'
  }

  return (
    <div className="bg-[#04080F] min-h-screen text-white">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(0,200,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-cyan-400 mb-3">
              <span className="w-5 h-px bg-cyan-400" />
              Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
              Welcome, <span className="text-cyan-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-400 text-sm">Roll: {user?.rollNumber} · {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}</p>
          </div>
          <button
            onClick={() => navigate('/scan')}
            className="flex items-center justify-center gap-2 bg-cyan-400 text-[#04080F] font-semibold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-all cursor-pointer w-full sm:w-auto"
          >
            📷 Mark Attendance
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#0A1221] border border-cyan-500/10 rounded-xl p-1 w-full sm:w-fit overflow-x-auto">
          {['overview', 'records', 'face'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-cyan-400 text-[#04080F]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'face' ? '📸 Face' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Overall %', value: `${overallPct}%`, color: getStatusColor(overallPct) },
                { label: 'Days Present', value: totalPresent, color: '#00FF94' },
                { label: 'Days Absent', value: records.length - totalPresent, color: '#FF4444' },
                { label: 'Total Classes', value: records.length, color: '#00C8FF' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 mb-2">{s.label}</div>
                  <div className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: s.color }}>
                    {loading ? '...' : s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Subject Stats */}
            <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-5">Subject-wise Attendance</h3>
              {loading ? (
                <p className="text-slate-400 text-sm">Loading...</p>
              ) : stats.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-sm">No attendance records yet</p>
                  <button onClick={() => navigate('/scan')} className="mt-4 text-cyan-400 text-sm hover:underline">
                    Mark attendance now →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-white">{s.subject}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400">{s.present}/{s.total}</span>
                          <span className="text-sm font-semibold" style={{ color: getStatusColor(s.percentage) }}>
                            {s.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width:`${s.percentage}%`, background: getStatusColor(s.percentage) }}/>
                      </div>
                      {s.percentage < 75 && (
                        <p className="text-xs text-amber-400 mt-1">⚠️ Below 75% — Attendance low!</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-5">Attendance Log</h3>
            {loading ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : records.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500 text-sm">No records found</p>
              </div>
            ) : (
              <>
                {/* Mobile view — cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {records.map((r, i) => (
                    <div key={i} className="bg-[#04080F] border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">{r.subject}</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: r.status === 'present' ? 'rgba(0,255,148,0.1)' : 'rgba(255,68,68,0.1)',
                            border: r.status === 'present' ? '1px solid rgba(0,255,148,0.2)' : '1px solid rgba(255,68,68,0.2)',
                            color: r.status === 'present' ? '#00FF94' : '#FF4444',
                          }}>
                          {r.status === 'present' ? '✓ Present' : '✗ Absent'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>📅 {r.date}</span>
                        <span>🕐 {r.time}</span>
                        <span className="text-emerald-400">🎯 {r.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop view — table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Date', 'Subject', 'Time', 'Confidence', 'Status'].map(h => (
                          <th key={h} className="text-left text-xs text-slate-400 uppercase tracking-wider pb-3 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {records.map((r, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 text-slate-300">{r.date}</td>
                          <td className="py-3 text-white font-medium">{r.subject}</td>
                          <td className="py-3 text-slate-400">{r.time}</td>
                          <td className="py-3 text-emerald-400">{r.confidence}%</td>
                          <td className="py-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: r.status === 'present' ? 'rgba(0,255,148,0.1)' : 'rgba(255,68,68,0.1)',
                                border: r.status === 'present' ? '1px solid rgba(0,255,148,0.2)' : '1px solid rgba(255,68,68,0.2)',
                                color: r.status === 'present' ? '#00FF94' : '#FF4444',
                              }}>
                              {r.status === 'present' ? '✓ Present' : '✗ Absent'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Face Tab */}
        {activeTab === 'face' && (
          <div className="max-w-md mx-auto">
            <p className="text-slate-400 text-sm mb-6">
              Register your face once to enable automatic attendance scanning.
            </p>
            <FaceRegister />
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard