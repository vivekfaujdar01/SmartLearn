import CourseList from "./pages/CourseList"
import Login from "./pages/Login"
import  Register from "./pages/Register"
import { Route,BrowserRouter,Routes } from "react-router-dom"
import Articles from "./pages/Articles"
import Games from "./pages/Games"
import Landing from "./pages/Landing"
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/articles" element={<Articles />}/>
        <Route path="/landing" element={<Landing />}/>
        <Route path="/courses" element={<CourseList />}/>
        <Route path="/games"  element={<Games />}/>
      </Routes>
      
    </BrowserRouter>
    
  )
}

export default App
