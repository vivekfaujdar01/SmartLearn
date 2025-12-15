import CourseList from "./pages/CourseList"
import Login from "./pages/Login"
import  Register from "./pages/Register"
import { Route,BrowserRouter,Router } from "react-router-dom"
import Articles from "./pages/Articles"
import Games from "./pages/Games"
function App() {
  
  return (
    <BrowserRouter>
      <Games />
      
    </BrowserRouter>
    
  )
}

export default App
