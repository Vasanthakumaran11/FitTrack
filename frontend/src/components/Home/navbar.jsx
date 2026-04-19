import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../login.jsx";

function Navbar() {
  const data = useContext(UserContext);
  const firstLetter = data ? data.charAt(0).toUpperCase() : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-gray-900">FitTrack</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-black transition-colors">Dashboard</Link>
          <Link to="/analysis" className="hover:text-black transition-colors">Analysis</Link>
        </nav>
        
        {/* User Avatar */}
        <div className="flex items-center gap-4">
          {data ? (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-xs font-semibold cursor-pointer">
              {firstLetter}
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium text-gray-900 hover:underline">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
