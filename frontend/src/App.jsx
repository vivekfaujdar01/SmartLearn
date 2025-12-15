import CourseList from "./pages/CourseList"
import Login from "./pages/Login"
import  Register from "./pages/Register"
import { Route,BrowserRouter,Router } from "react-router-dom"
import Articles from "./pages/Articles"
function App() {
  
  return (
    <BrowserRouter>
      <Articles />
      
    </BrowserRouter>
    
  )
}

export default App
