import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as faceapi from 'face-api.js'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Scan = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const videoRef = useRef(null)

  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [status, setStatus] = useState('idle')
  const [matchedUser, setMatchedUser] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [message, setMessage] = useState('')
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [alreadyMarked, setAlreadyMarked] = useState(false)
  const [subjectsLoading, setSubjectsLoading] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  // Load AI models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setMessage('Loading AI models...')
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ])
        setModelsLoaded(true)
        setMessage('')
      } catch {
        setMessage('❌ Failed to load models.')
      }
    }
    loadModels()
  }, [])

  // Fetch subjects from database
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true)
        const res = await axios.get('https://faceattend-backend.onrender.com/api/subjects')
        setSubjects(res.data)
        if (res.data.length > 0) {
          setSelectedSubject(res.data[0].name)
        }
      } catch {
        setMessage('❌ Failed to load subjects.')
      } finally {
        setSubjectsLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  // Fetch registered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://faceattend-backend.onrender.com/api/auth/users')
        const usersWithFace = res.data.filter(u => u.faceDescriptor && u.faceDescriptor.length > 0)
        setRegisteredUsers(usersWithFace)
      } catch {
        console.error('Failed to fetch users')
      }
    }
    fetchUsers()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      setCameraOn(true)
      setMessage('Camera started — click Scan Face')
    } catch {
      setMessage('❌ Camera access denied.')
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject
    if (stream) stream.getTracks().forEach(t => t.stop())
    videoRef.current.srcObject = null
    setCameraOn(false)
    setStatus('idle')
    setMatchedUser(null)
  }

  const scanFace = async () => {
    if (!modelsLoaded || !cameraOn) return
    if (!selectedSubject) {
      setMessage('❌ Please select a subject first.')
      return
    }
    setScanning(true)
    setStatus('scanning')
    setMessage('Scanning face...')

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detection) {
        setStatus('notfound')
        setMessage('❌ No face detected. Look at the camera.')
        setScanning(false)
        return
      }

      if (registeredUsers.length === 0) {
        setStatus('notfound')
        setMessage('❌ No registered faces found.')
        setScanning(false)
        return
      }

      const labeledDescriptors = registeredUsers.map(u => {
        const descriptor = new Float32Array(u.faceDescriptor)
        return new faceapi.LabeledFaceDescriptors(u._id, [descriptor])
      })

      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5)
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor)

      if (bestMatch.label === 'unknown') {
        setStatus('notfound')
        setMessage('❌ Face not recognized. Register your face first.')
        setScanning(false)
        return
      }

      const matchedPerson = registeredUsers.find(u => u._id === bestMatch.label)
      const conf = Math.round((1 - bestMatch.distance) * 100)

      setMatchedUser(matchedPerson)
      setConfidence(conf)
      setStatus('matched')
      setMessage(`✅ Face matched: ${matchedPerson.name} (${conf}%)`)

      await markAttendance(matchedPerson._id, conf)

    } catch {
      setMessage('❌ Scan failed. Try again.')
      setStatus('idle')
    } finally {
      setScanning(false)
    }
  }

  const markAttendance = async (studentId, conf) => {
    try {
      await axios.post(
        'https://faceattend-backend.onrender.com/api/attendance/mark',
        { studentId, subject: selectedSubject, confidence: conf },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setStatus('marked')
      setMessage(`🎉 Attendance marked for ${selectedSubject}!`)
    } catch (err) {
      if (err.response?.data?.message === 'Attendance already marked for today') {
        setAlreadyMarked(true)
        setStatus('marked')
        setMessage(`ℹ️ Already marked for ${selectedSubject} today.`)
      } else {
        setMessage('❌ Failed to mark attendance.')
      }
    }
  }

  const getStatusColor = () => {
    if (status === 'matched' || status === 'marked') return '#00FF94'
    if (status === 'notfound') return '#FF4444'
    if (status === 'scanning') return '#00C8FF'
    return '#5A6E92'
  }

  const getStatusText = () => {
    if (status === 'scanning') return 'Scanning...'
    if (status === 'matched') return 'Face Matched!'
    if (status === 'marked') return alreadyMarked ? 'Already Marked' : 'Attendance Marked!'
    if (status === 'notfound') return 'Not Found'
    return 'Ready'
  }

  return (
    <div className="bg-[#04080F] min-h-screen text-white">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(0,200,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-28 pb-16">

        <div className="mb-10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-cyan-400 mb-3">
            <span className="w-5 h-px bg-cyan-400" />
            Face Scan
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Mark Your <span className="text-cyan-400">Attendance</span>
          </h1>
          <p className="text-slate-400 text-sm">Select subject, start camera, and scan your face</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">

            {/* Subject Selector */}
            <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-6 mb-5">
              <label className="block text-sm text-slate-400 mb-3 font-medium">
                Select Subject
              </label>

              {subjectsLoading ? (
                <p className="text-slate-500 text-sm animate-pulse">Loading subjects...</p>
              ) : subjects.length === 0 ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-sm">
                  <p className="text-amber-400 font-medium">No subjects found!</p>
                  <p className="text-slate-400 text-xs mt-1">Ask admin to add subjects from Admin Panel → Subjects tab.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {subjects.map(sub => (
                    <button
                      key={sub._id}
                      onClick={() => setSelectedSubject(sub.name)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                        selectedSubject === sub.name
                          ? 'bg-cyan-400 text-[#04080F] border-cyan-400'
                          : 'bg-transparent text-slate-400 border-white/10 hover:border-cyan-500/30 hover:text-white'
                      }`}
                    >
                      {sub.name}
                      {sub.time && (
                        <span className="ml-2 text-xs opacity-60">{sub.time}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Camera Box */}
            <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-6">
              <div className="relative bg-black rounded-xl overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>

                <div className="absolute inset-0 z-10 pointer-events-none"
                  style={{ backgroundImage:'linear-gradient(rgba(0,200,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.04) 1px,transparent 1px)', backgroundSize:'20px 20px' }}/>

                {scanning && (
                  <div className="absolute left-0 right-0 h-0.5 z-20 pointer-events-none"
                    style={{ background:'linear-gradient(90deg,transparent,#00FF94,transparent)', animation:'scanMove 1.5s linear infinite' }}/>
                )}

                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                  style={{ display: cameraOn ? 'block' : 'none' }}
                />

                {!cameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="w-20 h-20 border-2 border-slate-600 rounded-full flex items-center justify-center mb-4">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5A6E92" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                    <p className="text-slate-500 text-sm">Camera is off</p>
                    <p className="text-slate-600 text-xs mt-1">Click "Start Camera" to begin</p>
                  </div>
                )}

                <div className="absolute top-3 left-3 w-4 h-4 z-20" style={{ borderTop:'2px solid #00C8FF', borderLeft:'2px solid #00C8FF' }}/>
                <div className="absolute top-3 right-3 w-4 h-4 z-20" style={{ borderTop:'2px solid #00C8FF', borderRight:'2px solid #00C8FF' }}/>
                <div className="absolute bottom-3 left-3 w-4 h-4 z-20" style={{ borderBottom:'2px solid #00C8FF', borderLeft:'2px solid #00C8FF' }}/>
                <div className="absolute bottom-3 right-3 w-4 h-4 z-20" style={{ borderBottom:'2px solid #00C8FF', borderRight:'2px solid #00C8FF' }}/>

                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background:'rgba(0,0,0,0.7)', border:`1px solid ${getStatusColor()}`, color: getStatusColor() }}>
                  ● {getStatusText()}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                {!cameraOn ? (
                  <button
                    onClick={startCamera}
                    disabled={!modelsLoaded}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                      modelsLoaded
                        ? 'bg-cyan-400 text-[#04080F] hover:opacity-90 cursor-pointer'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {modelsLoaded ? '📷 Start Camera' : '⏳ Loading Models...'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={scanFace}
                      disabled={scanning || subjects.length === 0}
                      className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                        scanning || subjects.length === 0
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-cyan-400 text-[#04080F] hover:opacity-90 cursor-pointer'
                      }`}
                    >
                      {scanning ? '🔍 Scanning...' : '🔍 Scan Face'}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-5 py-3 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      Stop
                    </button>
                  </>
                )}
              </div>

              {message && (
                <div className="mt-4 p-3 rounded-lg text-sm text-slate-300 bg-white/5 border border-white/10">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-5">

            {/* Match Result */}
            <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">Match Result</h3>

              {matchedUser ? (
                <div>
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                    </svg>
                  </div>
                  <div className="text-center mb-4">
                    <p className="text-white font-bold text-lg">{matchedUser.name}</p>
                    <p className="text-slate-400 text-sm">{matchedUser.rollNumber}</p>
                    <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs"
                      style={{ background:'rgba(0,255,148,0.1)', border:'1px solid rgba(0,255,148,0.2)', color:'#00FF94' }}>
                      ✓ Face Matched
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Confidence</span>
                      <span className="text-emerald-400 font-medium">{confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${confidence}%` }}/>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400 space-y-2">
                    <div className="flex justify-between">
                      <span>Subject</span>
                      <span className="text-white">{selectedSubject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="text-emerald-400">{alreadyMarked ? 'Already marked' : '✅ Present'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time</span>
                      <span className="text-white">{new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-14 h-14 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A6E92" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm">No match yet</p>
                  <p className="text-slate-600 text-xs mt-1">Start camera and scan</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">Today</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="text-white">{new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subject</span>
                  <span className="text-cyan-400 text-xs text-right max-w-[120px]">{selectedSubject || 'None selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Subjects</span>
                  <span className="text-white">{subjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Models</span>
                  <span className={modelsLoaded ? 'text-emerald-400' : 'text-amber-400'}>
                    {modelsLoaded ? '✅ Ready' : '⏳ Loading'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-lg text-sm border border-white/10 text-slate-400 hover:border-cyan-500/30 hover:text-white transition-all cursor-pointer"
            >
              View Dashboard →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanMove {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}

export default Scan