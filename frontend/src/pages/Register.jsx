import { useState } from "react";
import { registerUser } from "../services/auth";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(formData);
      localStorage.setItem("token", data.token);
      alert("Registration successful");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="border-2"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border-2"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="border-2"
        required
      />

      <select name="role" onChange={handleChange} className="border-2">
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>

      <button type="submit" className="border-2">Register</button>
    </form>
  );
}
