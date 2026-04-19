import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../login.jsx";

function Navbar() {
  const data = useContext(UserContext);
  const firstLetter = data ? data.charAt(0).toUpperCase() : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-gray-900">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-white">FitTrack</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
          <Link to="/analysis" className="hover:text-white transition-colors">Analysis</Link>
        </nav>
        
        {/* User Avatar */}
        <div className="flex items-center gap-4">
          {data ? (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm cursor-pointer">
              {firstLetter}
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium text-white hover:underline">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
