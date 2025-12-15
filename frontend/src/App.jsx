import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <h1>Auth Test App</h1>

        {/* Simple navigation */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/register" className="m-4 bg-blue-400 border-2">
            Register
          </Link>
          <Link to="/login" className="m-4 bg-blue-400 border-2">
            Login
          </Link>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Default route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
