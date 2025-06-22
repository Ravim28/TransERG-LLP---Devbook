import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Author", 
  });

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Email might already be used.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-2xl transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create an Account 🚀
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="Author">Author</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            onClick={handleRegister}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold rounded-lg shadow"
          >
            Register
          </button>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
