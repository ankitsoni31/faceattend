import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: "M9 11l3 3L22 4",
    title: "Auto Marking",
    desc: "Attendance is marked instantly the moment a registered face is detected. No manual entry required.",
    green: false,
  },
  {
    icon: "M3 4h18v16H3zM16 2v4M8 2v4M3 10h18",
    title: "Subject-wise Records",
    desc: "Track attendance per subject, per day with a complete historical log.",
    green: true,
  },
  {
    icon: "M18 20V10M12 20V4M6 20v-6",
    title: "Analytics Dashboard",
    desc: "Students view their own attendance charts. Admins access full class reports and low-attendance alerts.",
    green: false,
  },
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Secure & Private",
    desc: "All face data is processed locally in the browser. No biometric information is ever sent to a server.",
    green: true,
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up with your full name, admission number, and email address. Takes less than a minute.",
    icon: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  },
  {
    num: "02",
    title: "Register Your Face",
    desc: "After login, go to Dashboard → Face tab. Allow camera access and capture your face once.",
    icon: "M12 12c2.7 0 4-1.3 4-4s-1.3-4-4-4-4 1.3-4 4 1.3 4 4 4zm0 2c-4 0-8 2-8 4v1h16v-1c0-2-4-4-8-4z",
  },
  {
    num: "03",
    title: "Select Your Subject",
    desc: "Navigate to the Scan page and select the subject for which you want to mark your attendance.",
    icon: "M3 4h18v16H3zM16 2v4M8 2v4M3 10h18",
  },
  {
    num: "04",
    title: "Scan & Get Marked",
    desc: "Start the camera and look at the screen — the AI will recognize your face and mark you present instantly.",
    icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
  },
];

const techStack = [
  { name: "React.js", color: "#61DAFB" },
  { name: "Node.js", color: "#68A063" },
  { name: "Express.js", color: "#F0DB4F" },
  { name: "MongoDB", color: "#00FF94" },
  { name: "face-api.js", color: "#FF4785" },
  { name: "Tailwind CSS", color: "#38BDF8" },
  { name: "JWT Auth", color: "#A78BFA" },
];

const Home = () => {
  return (
    <div className="bg-[#04080F] min-h-screen text-white overflow-x-hidden">
      <Navbar />

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,200,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.025) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="fixed top-[-250px] left-[-150px] w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(0,200,255,0.055)", filter: "blur(140px)" }}
      />
      <div
        className="fixed bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(0,255,148,0.04)", filter: "blur(130px)" }}
      />

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <div
          className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-medium mb-10"
          style={{
            background: "rgba(0,200,255,0.08)",
            borderColor: "rgba(0,200,255,0.2)",
            color: "#00C8FF",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI-Powered Face Recognition System
        </div>

        <h1
          className="font-black tracking-tighter leading-[1] mb-6"
          style={{ fontSize: "clamp(52px,8vw,92px)" }}
        >
          Smart
          <br />
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(0,200,255,0.35)",
            }}
          >
            Attendance
          </span>
        </h1>

        <p className="max-w-md text-slate-400 text-base md:text-lg font-light leading-relaxed mb-10">
          Real-time face recognition for seamless attendance tracking. No cards,
          no roll calls — just look at the camera.
        </p>

        <div className="flex gap-3 flex-wrap justify-center mb-16">
          <Link
            to="/register"
            className="flex items-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "#00C8FF", color: "#04080F" }}
          >
            Get Started →
          </Link>
          <a
            href="#how"
            className="flex items-center gap-2 text-sm px-7 py-3.5 rounded-lg transition-all hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            ▶ See how it works
          </a>
        </div>

        <div className="flex flex-wrap gap-10 md:gap-16 justify-center">
          {[
            { num: "98", unit: "%", label: "Face accuracy" },
            { num: "2", unit: "s", label: "Recognition speed" },
            { num: "100", unit: "%", label: "Contactless" },
            { num: "24", unit: "/7", label: "Live tracking" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold tracking-tight leading-none">
                {s.num}
                <span style={{ color: "#00C8FF" }}>{s.unit}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-24" id="features">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest mb-3" style={{ color: "#00C8FF" }}>
          <span className="w-5 h-px" style={{ background: "#00C8FF" }} />
          Features
        </div>
        <h2
          className="font-black tracking-tighter text-white mb-14 max-w-xl leading-tight"
          style={{ fontSize: "clamp(30px,4vw,46px)" }}
        >
          Everything for{" "}
          <span style={{ color: "#00C8FF" }}>smart attendance</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Big card */}
          <div
            className="md:col-span-2 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
            style={{ background: "#0A1221", border: "1px solid rgba(0,200,255,0.1)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.18)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3" />
                <path d="M3 3h3v3M18 3h3v3M3 21h3v-3M18 21h3v-3" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Live Face Recognition</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Powered by face-api.js, the AI model runs entirely in your browser. Your face is matched locally in real time — no biometric data is ever uploaded to a server.
            </p>

            {/* Camera visual */}
            <div
              className="rounded-xl h-40 flex items-center justify-center relative overflow-hidden"
              style={{ background: "#000", border: "1px solid rgba(0,200,255,0.12)" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "linear-gradient(rgba(0,200,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.04) 1px,transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div
                className="absolute left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,#00FF94,transparent)", animation: "scanMove 2s linear infinite" }}
              />
              <div
                className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
                style={{ border: "2px solid #00FF94", animation: "pulse 2s ease-in-out infinite" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FF94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                </svg>
              </div>
              <div className="absolute top-2 left-2 w-3 h-3" style={{ borderTop: "2px solid #00C8FF", borderLeft: "2px solid #00C8FF" }} />
              <div className="absolute top-2 right-2 w-3 h-3" style={{ borderTop: "2px solid #00C8FF", borderRight: "2px solid #00C8FF" }} />
              <div className="absolute bottom-2 left-2 w-3 h-3" style={{ borderBottom: "2px solid #00C8FF", borderLeft: "2px solid #00C8FF" }} />
              <div className="absolute bottom-2 right-2 w-3 h-3" style={{ borderBottom: "2px solid #00C8FF", borderRight: "2px solid #00C8FF" }} />
            </div>
          </div>

          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "#0A1221", border: "1px solid rgba(0,200,255,0.1)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: f.green ? "rgba(0,255,148,0.08)" : "rgba(0,200,255,0.08)",
                  border: f.green ? "1px solid rgba(0,255,148,0.18)" : "1px solid rgba(0,200,255,0.18)",
                }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={f.green ? "#00FF94" : "#00C8FF"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.icon} />
                </svg>
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-24" id="how">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest mb-3" style={{ color: "#00C8FF" }}>
          <span className="w-5 h-px" style={{ background: "#00C8FF" }} />
          How it works
        </div>
        <h2
          className="font-black tracking-tighter text-white mb-14 leading-tight"
          style={{ fontSize: "clamp(30px,4vw,46px)" }}
        >
          Four simple <span style={{ color: "#00C8FF" }}>steps</span>
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-4 rounded-2xl overflow-hidden"
          style={{ background: "#0A1221", border: "1px solid rgba(0,200,255,0.1)" }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-7 transition-all hover:bg-[#0F1A2E]"
              style={{ borderRight: i < 3 ? "1px solid rgba(0,200,255,0.08)" : "none" }}
            >
              <div className="text-xs tracking-widest mb-4 flex items-center gap-3" style={{ color: "#00C8FF" }}>
                {s.num}
                <span className="flex-1 h-px" style={{ background: "rgba(0,200,255,0.15)" }} />
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(0,200,255,0.08)" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pb-24 text-center" id="tech">
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest mb-3" style={{ color: "#00C8FF" }}>
          <span className="w-5 h-px" style={{ background: "#00C8FF" }} />
          Tech Stack
          <span className="w-5 h-px" style={{ background: "#00C8FF" }} />
        </div>
        <h2 className="font-black tracking-tighter text-white mb-2" style={{ fontSize: "clamp(28px,4vw,42px)" }}>
          Built with <span style={{ color: "#00C8FF" }}>modern tech</span>
        </h2>
        <p className="text-slate-500 text-sm mb-10">Technologies you already know</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {techStack.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-400 transition-all hover:text-white"
              style={{ background: "#0A1221", border: "1px solid rgba(0,200,255,0.1)" }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
              {t.name}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 text-center px-6 py-24">
        <div
          className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-medium mb-8"
          style={{ background: "rgba(0,200,255,0.08)", borderColor: "rgba(0,200,255,0.2)", color: "#00C8FF" }}
        >
          Smart attendance powered by AI
        </div>
        <h2
          className="font-black tracking-tighter text-white mb-5 leading-tight"
          style={{ fontSize: "clamp(34px,5vw,58px)" }}
        >
          Ready to mark your <br />
          <span style={{ color: "#00C8FF" }}>attendance?</span>
        </h2>
        <p className="text-slate-400 font-light text-base mb-10 max-w-sm mx-auto">
          Register your face once and attendance will be marked automatically every day.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/register"
            className="flex items-center gap-2 font-semibold text-sm px-8 py-3.5 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
            style={{ background: "#00C8FF", color: "#04080F" }}
          >
            Register Now →
          </Link>
          <Link
            to="/login"
            className="text-sm px-8 py-3.5 rounded-lg transition-all hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            Login
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-cyan-500/10 bg-[#04080F]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-5">

          {/* Desktop */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white leading-none">
                Face<span className="text-cyan-400">Attend</span>
              </h2>
              <span className="text-sm text-slate-500">• Developed by</span>
              <span className="text-sm font-medium text-white">Ankit Soni</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/ankitsoni31" target="_blank" rel="noreferrer"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-1.5">
                {/* GitHub icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/ankit-soni-a47a1935b/" target="_blank" rel="noreferrer"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-1.5">
                {/* LinkedIn icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
              <a href="mailto:ankitsoni2261@gmail.com"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-1.5">
                {/* Email icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Contact
              </a>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col items-center text-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-1">
              <h2 className="text-base font-black text-white">
                Face<span className="text-cyan-400">Attend</span>
              </h2>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Developed by</span>
              <span className="text-xs font-medium text-white">Ankit Soni</span>
            </div>
            <div className="flex items-center justify-center gap-5 flex-wrap">
              <a href="https://github.com/ankitsoni31" target="_blank" rel="noreferrer"
                className="text-xs text-slate-500 hover:text-cyan-400 transition-all flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/ankit-soni-a47a1935b/" target="_blank" rel="noreferrer"
                className="text-xs text-slate-500 hover:text-cyan-400 transition-all flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
              <a href="mailto:ankitsoni2261@gmail.com"
                className="text-xs text-slate-500 hover:text-cyan-400 transition-all flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scanMove {
          0%   { top: 15%; }
          100% { top: 85%; }
        }
        @keyframes pulse {
          0%, 100% { border-color: #00FF94; }
          50%       { border-color: rgba(0,255,148,0.3); }
        }
      `}</style>
    </div>
  );
};

export default Home;