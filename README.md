# SmartLearn 🎓

A full-stack educational platform built with **React** (Frontend) and **Express.js** (Backend). SmartLearn enables students to learn through courses and articles, while instructors can create and manage educational content.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## 📁 Project Structure

```
SmartLearn/
├── backend/                 # Express.js REST API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   ├── middlewares/     # Auth, role, async handlers
│   │   ├── config/          # Database configuration
│   │   └── app.js           # Express app setup
│   └── package.json
│
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # API service functions
│   │   ├── context/         # React Context (Auth)
│   │   └── App.jsx          # Main app with routing
│   └── package.json
│
└── README.md                # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/vivekfaujdar01/SmartLearn.git
cd SmartLearn
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartlearn
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
ADMIN_SECRET=your_admin_secret_key
```

Start the backend server:

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

---

## 🔗 API Overview

| Base Path | Description |
|-----------|-------------|
| `/api/auth` | Authentication (Register/Login) |
| `/api/users` | User profile management |
| `/api/courses` | Course CRUD operations |
| `/api/articles` | Article CRUD with likes |
| `/api/admin` | Admin-only routes |
| `/api/enrollments` | Course enrollment |
| `/api/lessons` | Lesson management |

> **📖 For complete API documentation with request/response examples, see [`backend/README.md`](./backend/README.md)**

---

## 🎨 Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Home page with hero, features |
| `/login` | Login | User authentication |
| `/register` | Register | New user registration |
| `/courses` | Courses | Browse all courses |
| `/courses/:id` | Course Details | Course info, lessons, enrollment |
| `/articles` | Articles | Browse articles |
| `/articles/:id` | Article Details | Read article with likes |
| `/articles/create` | Create Article | Write new article |
| `/profile` | Profile | User profile management |
| `/dashboard` | Student Dashboard | Student's enrolled courses |
| `/instructor/dashboard` | Instructor Dashboard | Manage created & enrolled courses |
| `/admin/dashboard` | Admin Dashboard | Platform administration |
| `/games/tictactoe` | Tic Tac Toe | Fun brain-break game (requires login) |
| `/about` | About Us | About the platform |
| `/contact` | Contact | Contact form and information |

> **📖 For complete frontend documentation, see [`frontend/README.md`](./frontend/README.md)**

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Browse courses, enroll, read/write articles, like articles |
| **Instructor** | All student abilities + create/edit/delete own courses and lessons |
| **Admin** | All privileges + manage all content, access admin dashboard |

---

## 🛠 Tech Stack

### Backend
- **Express.js 5** - Web framework
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Icons
- **React Quill** - Rich text editor
- **DOMPurify** - HTML sanitization

---

## � Security Measures

SmartLearn implements multiple layers of security to protect user data and prevent attacks:

### Backend Security

| Feature | Implementation | Description |
|---------|----------------|-------------|
| **Security Headers** | `helmet` | Adds HTTP security headers (XSS protection, Content-Type sniffing prevention, etc.) |
| **Rate Limiting** | `express-rate-limit` | Prevents DDoS and brute-force attacks |
| **Password Hashing** | `bcryptjs` | Passwords are hashed with bcrypt before storage |
| **JWT Authentication** | `jsonwebtoken` | Secure stateless authentication with expiring tokens |
| **CORS Protection** | Configured origins | Only allowed origins can access the API |
| **Admin Secret** | Environment variable | Admin registration requires a secret key |
| **Request Size Limits** | Express config | JSON/URL-encoded bodies limited to 16kb |

### Rate Limiting Rules

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API (`/api/*`) | 100 requests | 15 minutes |
| Auth Routes (`/api/auth`) | 10 requests | 1 hour |

### Frontend Security

| Feature | Implementation | Description |
|---------|----------------|-------------|
| **HTML Sanitization** | `DOMPurify` | Prevents XSS attacks in rich text content |
| **Secure Token Storage** | localStorage | JWT stored client-side (consider httpOnly cookies for production) |
| **Role-based UI** | React Context | UI elements shown based on user role |

### Best Practices Implemented

- ✅ Passwords never returned in API responses
- ✅ JWT tokens expire after configured duration
- ✅ Role-based access control (Student, Instructor, Admin)
- ✅ Article/Course ownership validation before edit/delete
- ✅ Environment variables for sensitive configuration
- ✅ Input validation on all API endpoints

---

## �📝 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/smartlearn` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | `http://localhost:5173` |
| `ADMIN_SECRET` | Secret for admin registration/login | `admin-secret-key` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🧪 Available Scripts

### Backend

```bash
npm run dev     # Start with nodemon (hot reload)
npm start       # Start production server
```

### Frontend

```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Authors

- **Vivek Faujdar** - [GitHub](https://github.com/vivekfaujdar01)
