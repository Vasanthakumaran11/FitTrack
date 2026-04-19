import { Link } from "react-router-dom";
import { createContext } from "react";
import Navbar from "./Home/navbar";
export const UserContext = createContext();
function login (){
    
    return (
        <>
        <h1 className="text-3xl font-bold text-center mt-10">Login Page</h1>

      <form
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow flex flex-col"
      >
       
        <input
          type="text"
          name="username"
          placeholder="Username"
        
          className="border border-gray-300 rounded px-4 py-2 mt-4"
        />

       
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-300 rounded px-4 py-2 mt-4"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 mt-6 hover:bg-blue-600"
        >
          Login
        </button>
        </form>

      <Link
        to="/signup"
        className="text-blue-500 hover:underline block text-center mt-4"
      >
        Don't have an account? Sign Up
      </Link>
      </>
    )
}
export default login;