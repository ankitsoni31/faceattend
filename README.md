<div align="center">

<img src="https://img.shields.io/badge/FaceAttend-AI%20Attendance%20System-00C8FF?style=for-the-badge&logoColor=white" alt="FaceAttend" />

# FaceAttend — AI-Powered Smart Attendance System

**A real-world attendance management system powered by facial recognition AI.**  
Built for colleges and institutions to eliminate manual roll calls and proxy attendance.

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Developer](#-developer)

---

## 📖 About the Project

**FaceAttend** is a full-stack web application developed as a **TY B.Sc. Computer Science** academic project. It leverages AI-powered facial recognition to automate the attendance marking process in educational institutions.

Traditional attendance systems are time-consuming, prone to proxy entries, and require significant manual effort. FaceAttend eliminates these issues by:

- **Recognizing students' faces** in real time using the device camera
- **Automatically marking attendance** the moment a match is found
- **Providing detailed analytics** to both students and administrators
- **Enabling role-based access** for students and admin/teachers

> The face recognition model runs entirely in the browser using **face-api.js** — no biometric data is ever sent to the server, ensuring complete privacy.

---

## ✨ Key Features

### 👨‍🎓 Student Features
- Secure registration and login with JWT authentication
- One-time face registration via webcam
- Real-time AI face scanning for attendance
- Subject-wise attendance dashboard with percentage tracking
- Visual progress bars with low-attendance warnings (below 75%)
- Complete attendance history log

### 🛡️ Admin / Teacher Features
- Separate admin registration with secret code protection
- Admin dashboard with total students, present/absent count
- Dynamic subject management — add and delete subjects
- Full attendance records with search functionality
- Export attendance data as CSV
- Delete student accounts (removes all associated records)
- Role-based route protection

### 🤖 AI Features
- Real-time face detection using **face-api.js**
- 128-point face descriptor matching
- Confidence percentage displayed on match
- Runs completely client-side — privacy-first approach

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **AI / ML** | face-api.js (TensorFlow.js based) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **HTTP Client** | Axios |
| **Routing** | React Router DOM v6 |
| **Dev Tools** | Nodemon, Vite HMR |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (React + Vite)              │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  Pages   │  │Components│  │  face-api.js (AI)  │ │
│  │ Home     │  │ Navbar   │  │  - Face Detection  │ │
│  │ Login    │  │ FaceReg  │  │  - Face Matching   │ │
│  │ Register │  │          │  │  - 128-pt Vectors  │ │
│  │ Scan     │  │          │  │                    │ │
│  │Dashboard │  │          │  │                    │ │
│  │AdminPanel│  │          │  │                    │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / Axios
┌─────────────────────▼───────────────────────────────┐
│                  SERVER (Node.js + Express)          │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Auth Routes │  │  Attend.    │  │  Subject    │  │
│  │ /register   │  │  Routes     │  │  Routes     │  │
│  │ /login      │  │  /mark      │  │  /add       │  │
│  │ /save-face  │  │  /stats     │  │  /delete    │  │
│  │ /delete     │  │  /all       │  │  /list      │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ Mongoose
┌─────────────────────▼───────────────────────────────┐
│                    MongoDB Database                  │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │    Users    │  │ Attendances │  │  Subjects   │  │
│  │  name       │  │  student    │  │  name       │  │
│  │  rollNumber │  │  subject    │  │  code       │  │
│  │  email      │  │  date/time  │  │  time       │  │
│  │  password   │  │  status     │  │             │  │
│  │  role       │  │  confidence │  │             │  │
│  │  faceDesc[] │  │             │  │             │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local) or MongoDB Atlas
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optional, for GUI)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/ankitsoni31/faceattend.git
cd faceattend
```

**2. Setup Backend**

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see [Environment Variables](#-environment-variables)):

```bash
npm run dev
```

Server will start at `http://localhost:5000`

**3. Setup Frontend**

```bash
cd ../client
npm install
npm run dev
```

Frontend will start at `http://localhost:5173`

**4. Setup face-api.js Models**

Download the model weights from [face-api.js weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place them in:

```
client/public/models/
├── tiny_face_detector_model-weights_manifest.json
├── tiny_face_detector_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── face_landmark_68_model-shard1
├── face_recognition_model-weights_manifest.json
├── face_recognition_model-shard1
└── face_recognition_model-shard2
```

**5. Setup Admin Account**

- Register normally at `/register`
- Open MongoDB Compass → `faceattend_db` → `users`
- Find your document and change `role` from `"student"` to `"admin"`
- Or use the Admin Register page at `/admin-register` with the secret code

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` folder:

```env
MONGO_URI=mongodb://localhost:27017/faceattend_db
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
ADMIN_SECRET=your_admin_secret_code_here
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Backend server port (default: 5000) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `ADMIN_SECRET` | Secret code required for admin registration |

---

## ⚙️ How It Works

### Student Flow

```
Register Account → Login → Register Face (webcam) → 
Go to Scan Page → Select Subject → Start Camera → 
Face Scanned by AI → Attendance Marked ✅
```

### Admin Flow

```
Admin Register (with secret code) → Login → 
Admin Dashboard → Add Subjects → View All Students → 
View Attendance Records → Export CSV
```

### AI Face Recognition Flow

```
1. face-api.js loads 3 AI models from /public/models/
2. Webcam feed captured in real-time
3. TinyFaceDetector detects face in frame
4. FaceLandmark68Net finds 68 facial landmarks
5. FaceRecognitionNet generates 128-point face descriptor
6. FaceMatcher compares with stored descriptors
7. Best match found → attendance marked via API
```

---

## 📁 Project Structure

```
faceattend/
│
├── client/                     # React Frontend (Vite)
│   ├── public/
│   │   └── models/             # face-api.js AI model weights
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx       # Navigation with role-based links
│       │   └── FaceRegister.jsx # Face capture component
│       ├── context/
│       │   └── AuthContext.jsx  # Global auth state
│       ├── pages/
│       │   ├── Home.jsx         # Landing page
│       │   ├── Login.jsx        # Student/Admin login
│       │   ├── Register.jsx     # Student registration
│       │   ├── AdminRegister.jsx# Admin registration with secret code
│       │   ├── Scan.jsx         # AI face scanning page
│       │   ├── Dashboard.jsx    # Student dashboard
│       │   └── AdminPanel.jsx   # Admin control panel
│       ├── App.jsx              # Routes with role-based protection
│       └── main.jsx             # App entry point
│
└── server/                     # Node.js Backend
    ├── models/
    │   ├── User.js              # User schema (student/admin)
    │   ├── Attendance.js        # Attendance record schema
    │   └── Subject.js           # Subject schema
    ├── routes/
    │   ├── auth.js              # Auth routes
    │   ├── attendance.js        # Attendance routes
    │   └── subjects.js          # Subject routes
    ├── .env                     # Environment variables (not committed)
    ├── .env.example             # Environment variables template
    └── server.js                # Express app entry point
```

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register new student |
| `POST` | `/register-admin` | Register admin with secret code |
| `POST` | `/login` | Login (student or admin) |
| `POST` | `/save-face` | Save face descriptor |
| `GET` | `/users` | Get all students |
| `DELETE` | `/delete-student/:id` | Delete student + records |

### Attendance Routes — `/api/attendance`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/mark` | Mark attendance |
| `GET` | `/student/:id` | Get student's records |
| `GET` | `/stats/:id` | Get subject-wise stats |
| `GET` | `/all` | Get all records (admin) |

### Subject Routes — `/api/subjects`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all subjects |
| `POST` | `/add` | Add new subject |
| `DELETE` | `/:id` | Delete subject |

---

## 👨‍💻 Developer

<div align="center">

**Ankit Soni**  
TY B.Sc. Computer Science  
Academic Year 2026–27

[![GitHub](https://img.shields.io/badge/GitHub-ankitsoni31-181717?style=flat-square&logo=github)](https://github.com/ankitsoni31)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ankit%20Soni-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ankit-soni-a47a1935b/)
[![Email](https://img.shields.io/badge/Email-ankitsoni2261@gmail.com-D14836?style=flat-square&logo=gmail)](mailto:ankitsoni2261@gmail.com)

</div>

---

## 📄 License

This project is developed for academic purposes.  
© 2026 Ankit Soni. All rights reserved.

---

<div align="center">

**FaceAttend** — Making attendance smarter, one face at a time. 🎯

</div>
