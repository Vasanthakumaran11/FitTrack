import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../login.jsx";

function Navbar() {
  const Data = useContext(UserContext);
  const firstLetter = Data ? Data.charAt(0).toUpperCase() : "";

  return (
    <nav className="bg-black/95 backdrop-blur-md text-white px-8 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center rotate-3">
          <span className="font-black text-xl -rotate-3">F</span>
        </div>
        <h1 className="font-bold text-2xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          FitTrack
        </h1>
      </div>

      <div className="flex items-center space-x-10">
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-400">
          <li className="hover:text-white transition-colors cursor-pointer">Home</li>
          <li className="hover:text-white transition-colors cursor-pointer">About</li>
          <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
        </ul>
        

        <div className="flex items-center gap-6">
          {!Data && (
            <Link 
              to="/login"
              className="text-sm font-semibold hover:text-blue-400 transition-colors"
            >
              Login
            </Link>
          )}

          {Data && (
            <div className="relative group cursor-pointer">   
             <h1 className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold ">{firstLetter}</h1>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
