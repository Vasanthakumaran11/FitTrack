import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-gray-900">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-white">FitTrack</span>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/analysis" className="hover:text-white transition-colors">Analysis</Link>
          </nav>
        )}
        
        {/* User Auth Info */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs text-gray-400 font-medium">
                {user.username || user.email}
              </span>
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm cursor-default"
                title={user.username || user.email}
              >
                {firstLetter}
              </div>
              <button 
                onClick={handleLogout}
                className="text-white text-xs bg-red-600/20 hover:bg-red-600/40 border border-red-800/50 px-3 py-1.5 rounded-md transition-all font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/signup" className="text-white text-sm font-medium hover:underline">Sign Up</Link>
              <Link to="/login" className="bg-white text-black text-xs font-bold px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
