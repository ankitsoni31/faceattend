import { useState, useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const FaceRegister = () => {
  const { user, token } = useAuth()
  const videoRef = useRef(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [status, setStatus] = useState('') 
  const [success, setSuccess] = useState(false)

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus('Loading AI models...')
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ])
        setModelsLoaded(true)
        setStatus('')
      } catch {
        setStatus('❌ Failed to load models.')
      }
    }
    loadModels()
  }, [])

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      setCameraOn(true)
      setStatus('Camera ready — click Capture Face')
    } catch {
      setStatus('❌ Camera access denied.')
    }
  }

  // Stop camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject
    if (stream) stream.getTracks().forEach(t => t.stop())
    videoRef.current.srcObject = null
    setCameraOn(false)
  }

  // Capture face
  const captureFace = async () => {
    if (!modelsLoaded || !cameraOn) return
    setCapturing(true)
    setStatus('Detecting face...')

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detection) {
        setStatus('❌ No face detected. Look at the camera and try again.')
        setCapturing(false)
        return
      }

      setStatus('Face detected! Saving...')

      const descriptor = Array.from(detection.descriptor)

      await axios.post(
        'http://localhost:5000/api/auth/save-face',
        { rollNumber: user.rollNumber, faceDescriptor: descriptor },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setSuccess(true)
      setStatus('✅ Face registered successfully!')
      stopCamera()
    } catch {
      setStatus('❌ Failed to save face. Try again.')
    } finally {
      setCapturing(false)
    }
  }

  return (
    <div className="bg-[#0A1221] border border-cyan-500/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/15 rounded-xl flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="3"/>
            <path d="M3 3h3v3M18 3h3v3M3 21h3v-3M18 21h3v-3"/>
          </svg>
        </div>
        <div>
          <h3 className="text-white font-bold text-base">Register Your Face</h3>
          <p className="text-slate-400 text-xs">Required for attendance scanning</p>
        </div>
        {success && (
          <div className="ml-auto px-3 py-1 rounded-full text-xs font-medium"
            style={{ background:'rgba(0,255,148,0.1)', border:'1px solid rgba(0,255,148,0.2)', color:'#00FF94' }}>
            ✓ Registered
          </div>
        )}
      </div>

      {/* Camera */}
      <div className="relative bg-black rounded-xl overflow-hidden mb-4"
        style={{ aspectRatio: '4/3' }}>
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ backgroundImage:'linear-gradient(rgba(0,200,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.04) 1px,transparent 1px)', backgroundSize:'18px 18px' }}/>

        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
          style={{ display: cameraOn ? 'block' : 'none' }}
        />

        {!cameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ border:'2px solid rgba(0,200,255,0.2)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5A6E92" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
              </svg>
            </div>
            <p className="text-slate-500 text-sm">Camera off</p>
          </div>
        )}

        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 z-20" style={{ borderTop:'2px solid #00C8FF', borderLeft:'2px solid #00C8FF' }}/>
        <div className="absolute top-2 right-2 w-3 h-3 z-20" style={{ borderTop:'2px solid #00C8FF', borderRight:'2px solid #00C8FF' }}/>
        <div className="absolute bottom-2 left-2 w-3 h-3 z-20" style={{ borderBottom:'2px solid #00C8FF', borderLeft:'2px solid #00C8FF' }}/>
        <div className="absolute bottom-2 right-2 w-3 h-3 z-20" style={{ borderBottom:'2px solid #00C8FF', borderRight:'2px solid #00C8FF' }}/>
      </div>

      {/* Status */}
      {status && (
        <div className="mb-4 p-3 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300">
          {status}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        {!cameraOn ? (
          <button
            onClick={startCamera}
            disabled={!modelsLoaded || success}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              !modelsLoaded || success
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-cyan-400 text-[#04080F] hover:opacity-90'
            }`}
          >
            {success ? '✅ Face Registered' : modelsLoaded ? '📷 Open Camera' : '⏳ Loading...'}
          </button>
        ) : (
          <>
            <button
              onClick={captureFace}
              disabled={capturing}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                capturing
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-400 text-[#04080F] hover:opacity-90'
              }`}
            >
              {capturing ? '📸 Capturing...' : '📸 Capture Face'}
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-3 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default FaceRegister