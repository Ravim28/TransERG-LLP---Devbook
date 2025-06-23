// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminDashboard from "./pages/AdminDashboard";
// import AuthorDashboard from "./pages/AuthorDashboard";
// import { getUser, isLoggedIn } from "./utils/auth";

// function App() {
//   const [user, setUser] = useState(getUser());
//   const [loggedIn, setLoggedIn] = useState(isLoggedIn());

//   useEffect(() => {
//     const sync = () => {
//       setUser(getUser());
//       setLoggedIn(isLoggedIn());
//     };

//     window.addEventListener("storage", sync); // sync across tabs
//     return () => window.removeEventListener("storage", sync);
//   }, []);

//   return (
//     <Router>
//       <Navbar user={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUser={setUser} />
//       <div className="p-6">
//         <Routes>
//           <Route
//             path="/"
//             element={
//               loggedIn ? (
//                 user?.role === "Admin" ? <Navigate to="/admin" /> : <Navigate to="/author" />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route
//             path="/login"
//             element={
//               loggedIn ? (
//                 <Navigate to="/" />
//               ) : (
//                 <Login setUser={setUser} setLoggedIn={setLoggedIn} />
//               )
//             }
//           />
//           <Route
//             path="/register"
//             element={loggedIn ? <Navigate to="/" /> : <Register />}
//           />

//           <Route
//             path="/admin"
//             element={
//               loggedIn && user?.role === "Admin" ? <AdminDashboard /> : <Navigate to="/login" />
//             }
//           />
//           <Route
//             path="/author"
//             element={
//               loggedIn && user?.role === "Author" ? <AuthorDashboard /> : <Navigate to="/login" />
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import { getUser, isLoggedIn } from "./utils/auth";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AuthorDashboard = lazy(() => import("./pages/AuthorDashboard"));
const PublicPosts = lazy(() => import("./pages/PublicPosts"));

function App() {
const [user, setUser] = useState(getUser());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    const sync = () => {
      setUser(getUser());
      setLoggedIn(isLoggedIn());
    };
    window.addEventListener("storage", sync); // sync across tabs
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <Router>
      <Navbar user={user} loggedIn={loggedIn} setUser={setUser} setLoggedIn={setLoggedIn} />
      <div className="p-6">
<Suspense
  fallback={
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl text-blue-600 font-semibold animate-pulse">Loading...</div>
    </div>
  }
>  <Routes>
    {/* 👇 Default route redirected to Explore page */}
    <Route path="/" element={<Navigate to="/explore" />} />

    {/* Explore - public page */}
    <Route path="/explore" element={<PublicPosts />} />

    {/* Auth pages */}
    <Route
      path="/login"
      element={
        loggedIn ? (
          <Navigate to={user?.role === "Admin" ? "/admin" : "/author"} />
        ) : (
          <Login setUser={setUser} setLoggedIn={setLoggedIn} />
        )
      }
    />
    <Route
      path="/register"
      element={loggedIn ? <Navigate to="/" /> : <Register />}
    />

    {/* Admin Dashboard */}
    <Route
      path="/admin"
      element={
        loggedIn && user?.role === "Admin" ? (
          <AdminDashboard />
        ) : (
          <Navigate to="/login" />
        )
      }
    />

    {/* Author Dashboard */}
    <Route
      path="/author"
      element={
        loggedIn && user?.role === "Author" ? (
          <AuthorDashboard />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  </Routes>
</Suspense>

      </div>
    </Router>
  );
}

export default App;
