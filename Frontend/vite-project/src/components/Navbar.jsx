import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar({ user, loggedIn, setUser, setLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setLoggedIn(false);
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white px-7 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
       <button
  onClick={() => setMenuOpen(!menuOpen)}
  className="md:hidden text-white"
>

            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-bold">DevBook</h1>
        </div>

        <div className="hidden md:flex space-x-4 items-center">
          { loggedIn && user?.role === "Admin" && (
            <Link to="/admin" className="hover:underline font-bold">Admin Dashboard</Link>
          )}
          {loggedIn && user?.role === "Author" && (
            <Link to="/author" className="hover:underline font-bold ">Author Dashboard</Link>
          )}

          { !loggedIn && (
            <>
              <Link to="/login" className="hover:underline font-bold">Get Started 🚀</Link>
              <Link to="/explore" className="hover:underline font-bold">Explore Blogs</Link>
            </>
          )}

          { loggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 font-bold"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2 font-bold">
          {loggedIn && user?.role === "Admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
          )}
          {loggedIn && user?.role === "Author" && (
            <Link to="/author" onClick={() => setMenuOpen(false)}>Author Dashboard</Link>
          )}

          {!loggedIn && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore Blogs</Link>
            </>
          )}

          {loggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 font-bold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
  </>
  );
}

export default Navbar;
