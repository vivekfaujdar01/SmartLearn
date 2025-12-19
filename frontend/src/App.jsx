import Login from "./pages/Login"
import  Register from "./pages/Register"
import { Toaster } from "sonner";
import { Route,BrowserRouter,Routes } from "react-router-dom"
import Articles from "./pages/Articles"
import CreateArticle from "./pages/CreateArticle"
import ArticleDetails from "./pages/ArticleDetails"
import EditArticle from "./pages/EditArticle"
import Courses from "./pages/Courses"
import LandingPage from "./pages/LandingPage"
import Profile from "./pages/Profile"
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import CreateCourse from "./pages/CreateCourse";
import AddChapter from "./pages/AddChapter";

import EditCourse from "./pages/EditCourse";
import CourseDetails from "./pages/CourseDetails";
import TicTacToe from "./pages/TicTacToe";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

export default function App() {
  
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="pt-20"> {/* Add padding top to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />}/>
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/register" element={<Register />}/>
            <Route path="/articles" element={<Articles />}/>
            <Route path="/articles/create" element={<CreateArticle />}/>
            <Route path="/articles/:id" element={<ArticleDetails />}/>
            <Route path="/articles/:id/edit" element={<EditArticle />}/>
            <Route path="/profile"  element={<Profile />}/>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/create-course" element={<CreateCourse />} />
            <Route path="/instructor/course/:courseId/add-chapter" element={<AddChapter />} />
            <Route path="/instructor/course/:courseId/edit" element={<EditCourse />} />
            <Route path="/games/tictactoe" element={<TicTacToe />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}
