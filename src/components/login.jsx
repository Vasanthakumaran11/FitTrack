import { Link } from "react-router-dom";
import { createContext } from "react";
import Navbar from "./Home/navbar";
export const UserContext = createContext();
function login (){
    
    return (
        <>
        <h1 className="text-3xl font-bold text-center mt-10">Login Page</h1>
       

        <Link to="/signup" className="text-blue-500 hover:underline block text-center mt-4">
            Don't have an account? Sign Up
        </Link>
       
        <Link to="/Home" className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 block text-center">
            Login
        </Link>
        
        </>
    )
}
export default login;