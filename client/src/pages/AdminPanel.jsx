import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const AdminPanel = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [records, setRecords] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', time: '' })
  const [subjectError, setSubjectError] = useState('')
  const [subjectLoading, setSubjectLoading] = useState(false)

  const [deleteModal, setDeleteModal] = useState({ open: false, student: null })
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'admin') { navigate('/dashboard'); return }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [recRes, stuRes, subRes] = await Promise.all([
        axios.get('https://faceattend-backend.onrender.com/api/attendance/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://faceattend-backend.onrender.com/api/auth/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://faceattend-backend.onrender.com/api/subjects'),
      ])
      setRecords(recRes.data)
      setStudents(stuRes.data)
      setSubjects(subRes.data)
    } catch (err) {
      console.error('Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubject = async (e) => {
    e.preventDefault()
    setSubjectError('')
    setSubjectLoading(true)
    try {
      await axios.post('https://faceattend-backend.onrender.com/api/subjects/add', subjectForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSubjectForm({ name: '', code: '', time: '' })
      fetchData()
    } catch (err) {
      setSubjectError(err.response?.data?.message || 'Failed to add subject')
    } finally {
      setSubjectLoading(false)
    }
  }

  const handleDeleteSubject = async (id) => {
    if (!confirm('Delete this subject?')) return
    try {
      await axios.delete(`https://faceattend-backend.onrender.com/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch {
      alert('Failed to delete subject')
    }
  }

  const openDeleteModal = (student) => setDeleteModal({ open: true, student })
  const closeDeleteModal = () => setDeleteModal({ open: false, student: null })

  const confirmDeleteStudent = async () => {
    if (!deleteModal.student) return
    setDeleteLoading(true)
    try {
      await axios.delete(
        `https://faceattend-backend.onrender.com/api/auth/delete-student/${deleteModal.student._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      closeDeleteModal()
      fetchData()
    } catch {
      alert('Failed to delete student')
    } finally {
      setDeleteLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const todayRecords = records.filter(r => r.date === today)
  const presentToday = todayRecords.filter(r => r.status === 'present').length

  const filtered = records.filter(r =>
    r.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.student?.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const exportCSV = () => {
    const headers = ['Name', 'Roll Number', 'Subject', 'Date', 'Time', 'Status', 'Confidence']
    const rows = records.map(r => [
      r.student?.name || '',
      r.student?.rollNumber || '',
      r.subject,
      r.date,
      r.time,
      r.status,
      `${r.confidence}%`
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_${today}.csv`
    a.click()
  }

  const getStatusColor = (pct) => {
    if (pct >= 75) return '#00FF94'
    if (pct >= 60) return '#F0DB4F'
    return '#FF4444'
  }

  return (
    <div className="bg-[#04080F] min-h-screen text-white">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(0,200,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="fixed top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[140px] pointer-events-none z-0" />

      {/* DELETE MODAL */}
      {deleteModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
        >
          <div className="bg-[#0A1221] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </div>
            <h3 className="text-white font-black text-lg text-center mb-1">Delete Student?</h3>
            <p className="text-slate-400 text-sm text-center mb-1">Are you sure you want to delete</p>
            <p className="text-white font-bold text-center text-base mb-1">{deleteModal.student?.name}</p>
            <p className="text-slate-500 text-xs text-center mb-5">Roll: {deleteModal.student?.rollNumber}</p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-5">
              <p className="text-red-400 text-xs text-center leading-relaxed">
                ⚠️ This will permanently delete the student and ALL their attendance records!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-3 rounded-xl text-sm border border-white/10 text-slate-400 hover:border-white/25 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStudent}
                disabled={deleteLoading}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  deleteLoading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 mb-2">
              <span className="w-4 h-px bg-amber-400" />
              Admin Panel
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-1">
              Admin <span className="text-amber-400">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm">Manage students, subjects and attendance</p>
          </div>
          <button
            onClick={exportCSV}
            className="self-start sm:self-auto flex items-center gap-2 border border-cyan-500/20 text-cyan-400 text-sm px-4 py-2.5 rounded-xl hover:bg-cyan-500/10 transition-all cursor-pointer whitespace-nowrap"
          >
            ⬇️ Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Total Students', value: students.length, color: '#00C8FF' },
            { label: 'Present Today', value: presentToday, color: '#00FF94' },
            { label: 'Absent Today', value: students.length - presentToday, color: '#FF4444' },
            { label: 'Total Subjects', value: subjects.length, color: '#F0DB4F' },
          ].map((s, i) => (
            <div key={i} className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-4 sm:p-5">
              <div className="text-xs text-slate-400 mb-2 leading-tight">{s.label}</div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: s.color }}>
                {loading ? '...' : s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 sm:mb-8 bg-[#0A1221] border border-cyan-500/10 rounded-xl p-1">
          {['overview', 'subjects', 'students', 'records'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer capitalize text-center ${
                activeTab === tab ? 'bg-amber-400 text-[#04080F]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'subjects' ? '📚 Subjects' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-4 sm:p-6">
            <h3 className="text-white font-bold mb-5 text-sm sm:text-base">
              Today's Attendance —{' '}
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </h3>
            {loading ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : todayRecords.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">No attendance marked today yet</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Student', 'Roll No', 'Subject', 'Time', 'Confidence', 'Status'].map(h => (
                          <th key={h} className="text-left text-xs text-slate-400 uppercase tracking-wider pb-3 pr-4 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {todayRecords.map((r, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4 text-white font-medium">{r.student?.name}</td>
                          <td className="py-3 pr-4 text-slate-400">{r.student?.rollNumber}</td>
                          <td className="py-3 pr-4 text-slate-300">{r.subject}</td>
                          <td className="py-3 pr-4 text-slate-400">{r.time}</td>
                          <td className="py-3 pr-4 text-emerald-400">{r.confidence}%</td>
                          <td className="py-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{ background: 'rgba(0,255,148,0.1)', border: '1px solid rgba(0,255,148,0.2)', color: '#00FF94' }}>
                              ✓ Present
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {todayRecords.map((r, i) => (
                    <div key={i} className="bg-[#04080F] border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-semibold text-sm">{r.student?.name}</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                          style={{ background: 'rgba(0,255,148,0.1)', border: '1px solid rgba(0,255,148,0.2)', color: '#00FF94' }}>
                          ✓ Present
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                        <div>
                          <p className="text-slate-500 text-xs mb-0.5">Roll No</p>
                          <p className="text-slate-300 text-xs font-medium">{r.student?.rollNumber}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-0.5">Subject</p>
                          <p className="text-slate-300 text-xs font-medium">{r.subject}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-0.5">Time</p>
                          <p className="text-slate-300 text-xs font-medium">{r.time}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-0.5">Confidence</p>
                          <p className="text-emerald-400 text-xs font-medium">{r.confidence}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SUBJECTS TAB ── */}
        {activeTab === 'subjects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* Add Subject Form */}
            <div className="bg-[#0A1221] border border-amber-500/10 rounded-2xl p-4 sm:p-6">
              <h3 className="text-white font-bold mb-5 text-sm sm:text-base">➕ Add New Subject</h3>
              {subjectError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">
                  {subjectError}
                </div>
              )}
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Subject Name</label>
                  <input
                    type="text"
                    value={subjectForm.name}
                    onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    placeholder="e.g. Data Structures"
                    required
                    className="w-full px-4 py-3 text-sm bg-[#04080F] border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Subject Code</label>
                  <input
                    type="text"
                    value={subjectForm.code}
                    onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    placeholder="e.g. CS301"
                    required
                    className="w-full px-4 py-3 text-sm bg-[#04080F] border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">
                    Class Time <span className="text-slate-600 normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subjectForm.time}
                    onChange={e => setSubjectForm({ ...subjectForm, time: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-4 py-3 text-sm bg-[#04080F] border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subjectLoading}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    subjectLoading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-amber-400 text-[#04080F] hover:opacity-90'
                  }`}
                >
                  {subjectLoading ? 'Adding...' : '➕ Add Subject'}
                </button>
              </form>
            </div>

            {/* Subjects List */}
            <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-4 sm:p-6">
              <h3 className="text-white font-bold mb-5 text-sm sm:text-base">📚 All Subjects ({subjects.length})</h3>
              {loading ? (
                <p className="text-slate-400 text-sm">Loading...</p>
              ) : subjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-sm">No subjects added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {subjects.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-4 bg-[#04080F] rounded-xl border border-white/5">
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium mb-1.5 truncate">{s.name}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">{s.code}</span>
                          {s.time && <span className="text-xs text-slate-500">{s.time}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubject(s._id)}
                        className="flex-shrink-0 text-red-400 hover:text-red-300 text-xs border border-red-500/20 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STUDENTS TAB ── */}
        {activeTab === 'students' && (
          <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-4 sm:p-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <h3 className="text-white font-bold text-sm sm:text-base">All Students ({students.length})</h3>
              <input
                type="text"
                placeholder="Search by name or roll..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-52 px-4 py-2.5 text-sm bg-[#04080F] border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500/50 placeholder:text-slate-600 transition-colors"
              />
            </div>

            {loading ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Name', 'Roll No', 'Email', 'Face', 'Classes', 'Attendance %', 'Action'].map(h => (
                          <th key={h} className="text-left text-xs text-slate-400 uppercase tracking-wider pb-3 pr-4 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {students
                        .filter(s =>
                          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((s, i) => {
                          const stuRecs = records.filter(r => r.student?._id === s._id || r.student === s._id)
                          const pct = stuRecs.length > 0
                            ? Math.round((stuRecs.filter(r => r.status === 'present').length / stuRecs.length) * 100)
                            : 0
                          return (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 pr-4 text-white font-medium">{s.name}</td>
                              <td className="py-3 pr-4 text-slate-400">{s.rollNumber}</td>
                              <td className="py-3 pr-4 text-slate-400 text-xs">{s.email}</td>
                              <td className="py-3 pr-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${s.faceDescriptor?.length > 0 ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-slate-400 bg-white/5 border border-white/10'}`}>
                                  {s.faceDescriptor?.length > 0 ? '✓ Yes' : '✗ No'}
                                </span>
                              </td>
                              <td className="py-3 pr-4 text-slate-300">{stuRecs.length}</td>
                              <td className="py-3 pr-4">
                                <span className="font-semibold" style={{ color: getStatusColor(pct) }}>{pct}%</span>
                                {pct < 75 && pct > 0 && <span className="ml-1.5 text-xs text-amber-400">⚠️</span>}
                              </td>
                              <td className="py-3">
                                <button
                                  onClick={() => openDeleteModal(s)}
                                  className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all cursor-pointer"
                                >
                                  🗑️ Delete
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {students
                    .filter(s =>
                      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((s, i) => {
                      const stuRecs = records.filter(r => r.student?._id === s._id || r.student === s._id)
                      const pct = stuRecs.length > 0
                        ? Math.round((stuRecs.filter(r => r.status === 'present').length / stuRecs.length) * 100)
                        : 0
                      return (
                        <div key={i} className="bg-[#04080F] border border-white/5 rounded-xl p-4">
                          {/* Top row: name + attendance % */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-white font-semibold text-sm leading-tight">{s.name}</p>
                              <p className="text-slate-500 text-xs mt-0.5">{s.rollNumber}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="font-bold text-lg leading-none" style={{ color: getStatusColor(pct) }}>
                                {pct}%
                              </span>
                              {pct < 75 && pct > 0 && <span className="text-xs text-amber-400">⚠️</span>}
                            </div>
                          </div>

                          {/* Info grid */}
                          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-3">
                            <div className="col-span-2">
                              <p className="text-slate-500 text-xs mb-0.5">Email</p>
                              <p className="text-slate-300 text-xs font-medium truncate">{s.email}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs mb-0.5">Classes</p>
                              <p className="text-slate-300 text-xs font-medium">{stuRecs.length}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs mb-0.5">Face Data</p>
                              <span className={`inline-block text-xs px-2 py-0.5 rounded-md font-medium ${
                                s.faceDescriptor?.length > 0
                                  ? 'text-emerald-400 bg-emerald-400/10'
                                  : 'text-slate-400 bg-white/5'
                              }`}>
                                {s.faceDescriptor?.length > 0 ? '✓ Registered' : '✗ Not set'}
                              </span>
                            </div>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={() => openDeleteModal(s)}
                            className="w-full text-xs py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all cursor-pointer font-medium"
                          >
                            🗑️ Delete Student
                          </button>
                        </div>
                      )
                    })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── RECORDS TAB ── */}
        {activeTab === 'records' && (
          <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-4 sm:p-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <h3 className="text-white font-bold text-sm sm:text-base">All Records ({records.length})</h3>
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 px-4 py-2.5 text-sm bg-[#04080F] border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500/50 placeholder:text-slate-600 transition-colors"
              />
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Student', 'Roll No', 'Subject', 'Date', 'Time', 'Confidence', 'Status'].map(h => (
                      <th key={h} className="text-left text-xs text-slate-400 uppercase tracking-wider pb-3 pr-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.slice(0, 50).map((r, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 text-white font-medium">{r.student?.name}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.student?.rollNumber}</td>
                      <td className="py-3 pr-4 text-slate-300">{r.subject}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.date}</td>
                      <td className="py-3 pr-4 text-slate-400">{r.time}</td>
                      <td className="py-3 pr-4 text-emerald-400">{r.confidence}%</td>
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

            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {filtered.slice(0, 50).map((r, i) => (
                <div key={i} className="bg-[#04080F] border border-white/5 rounded-xl p-4">
                  {/* Top row: name + status badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold text-sm leading-tight">{r.student?.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{r.student?.rollNumber}</p>
                    </div>
                    <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: r.status === 'present' ? 'rgba(0,255,148,0.1)' : 'rgba(255,68,68,0.1)',
                        border: r.status === 'present' ? '1px solid rgba(0,255,148,0.2)' : '1px solid rgba(255,68,68,0.2)',
                        color: r.status === 'present' ? '#00FF94' : '#FF4444',
                      }}>
                      {r.status === 'present' ? '✓ Present' : '✗ Absent'}
                    </span>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Subject</p>
                      <p className="text-slate-300 text-xs font-medium">{r.subject}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Date</p>
                      <p className="text-slate-300 text-xs font-medium">{r.date}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Time</p>
                      <p className="text-slate-300 text-xs font-medium">{r.time}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Confidence</p>
                      <p className="text-emerald-400 text-xs font-medium">{r.confidence}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length > 50 && (
              <p className="text-slate-500 text-xs mt-4 text-center">Showing 50 of {filtered.length} records</p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminPanel