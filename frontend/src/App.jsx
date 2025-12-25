// Main App component - Entry point for the React application
import Login from "./pages/Login" // Login page component
import  Register from "./pages/Register" // User registration page component
import { Toaster } from "sonner"; // Toast notification component for displaying alerts
import { Route,BrowserRouter,Routes } from "react-router-dom" // React Router components for client-side routing
import Articles from "./pages/Articles" // Articles listing page
import CreateArticle from "./pages/CreateArticle" // Article creation form page
import ArticleDetails from "./pages/ArticleDetails" // Single article detail view page
import EditArticle from "./pages/EditArticle" // Article editing form page
import Courses from "./pages/Courses" // Courses listing page
import LandingPage from "./pages/LandingPage" // Homepage/landing page
import Profile from "./pages/Profile" // User profile page
import StudentDashboard from "./pages/StudentDashboard"; // Student dashboard with enrolled courses
import AdminDashboard from "./pages/AdminDashboard"; // Admin dashboard for managing users/content
import InstructorDashboard from "./pages/InstructorDashboard"; // Instructor dashboard for managing courses
import CreateCourse from "./pages/CreateCourse"; // Course creation form page
import AddChapter from "./pages/AddChapter"; // Add chapter/lesson to course page

import EditCourse from "./pages/EditCourse"; // Course editing form page
import CourseDetails from "./pages/CourseDetails"; // Single course detail view page
import TicTacToe from "./pages/TicTacToe"; // Tic Tac Toe game page
import About from "./pages/About"; // About page
import Contact from "./pages/Contact"; // Contact page
import { AuthProvider } from "./context/AuthContext"; // Authentication context provider for global auth state
import ProtectedRoute from "./components/ProtectedRoute"; // Higher-order component to protect routes requiring authentication
import { ThemeProvider } from "./context/ThemeContext"; // Theme context provider for dark/light mode
import Navbar from "./components/Navbar"; // Global navigation bar component

export default function App() {
  
  return (
    // ThemeProvider wraps app to provide dark/light theme toggle functionality
    <ThemeProvider>
    {/* BrowserRouter enables client-side routing using HTML5 history API */}
    <BrowserRouter>
      {/* AuthProvider wraps app to provide authentication state globally */}
      <AuthProvider>
        {/* Global navigation bar - appears on all pages */}
        <Navbar />
        {/* Main content area with padding to account for fixed navbar */}
        <div className="pt-20"> {/* Add padding top to account for fixed navbar */}
          {/* Route definitions for different pages */}
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Homepage route */}
            <Route path="/login" element={<Login />} /> {/* Login page route */}
            <Route path="/courses" element={<Courses />}/> {/* Courses listing route */}
            <Route path="/courses/:id" element={<CourseDetails />} /> {/* Individual course details route with dynamic ID */}
            <Route path="/register" element={<Register />}/> {/* User registration route */}
            <Route path="/articles" element={<Articles />}/> {/* Articles listing route */}
            <Route path="/articles/create" element={<CreateArticle />}/> {/* Create article route */}
            <Route path="/articles/:id" element={<ArticleDetails />}/> {/* Individual article details route with dynamic ID */}
            <Route path="/articles/:id/edit" element={<EditArticle />}/> {/* Edit article route with dynamic ID */}
            <Route path="/profile"  element={<Profile />}/> {/* User profile route */}
            <Route path="/dashboard" element={<StudentDashboard />} /> {/* Student dashboard route */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Admin dashboard route */}
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} /> {/* Instructor dashboard route */}
            <Route path="/instructor/create-course" element={<CreateCourse />} /> {/* Create course route for instructors */}
            <Route path="/instructor/course/:courseId/add-chapter" element={<AddChapter />} /> {/* Add chapter to course route */}
            <Route path="/instructor/course/:courseId/edit" element={<EditCourse />} /> {/* Edit course route */}
            <Route path="/games/tictactoe" element={<ProtectedRoute><TicTacToe /></ProtectedRoute>} /> {/* Protected game route - requires login */}
            <Route path="/about" element={<About />} /> {/* About page route */}
            <Route path="/contact" element={<Contact />} /> {/* Contact page route */}
          </Routes>
        </div>
        {/* Toast notification container - positioned at top-right */}
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}
