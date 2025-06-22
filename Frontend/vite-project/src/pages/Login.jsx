import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setUser, setLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setLoggedIn(true);

      if (user.role === "Admin") {
        navigate("/admin");
      } else if (user.role === "Author") {
        navigate("/author");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-2xl transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Welcome Back 👋
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold rounded-lg shadow"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
