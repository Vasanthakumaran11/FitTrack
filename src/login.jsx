import { Link } from "react-router-dom";

function login (){
    return (
        <>
        <h1 className="text-3xl font-bold text-center mt-10">Login Page</h1>

        <Link to="/signup" className="text-blue-500 hover:underline block text-center mt-4">
            Don't have an account? Sign Up
        </Link>

        </>
    )
}
export default login;