import Login from "./pages/Login"
import  Register from "./pages/Register"
import { Route,BrowserRouter,Routes } from "react-router-dom"
import Articles from "./pages/Articles"
import Games from "./pages/Games"
import Courses from "./pages/Courses"
import LandingPage from "./pages/LandingPage"
import Profile from "./pages/Profile"
export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/articles" element={<Articles />}/>
        <Route path="/games"  element={<Games />}/>
        <Route path="/profile"  element={<Profile />}/>
      </Routes>
      
    </BrowserRouter>
    
  )
}
