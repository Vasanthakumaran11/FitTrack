import { useNavigate } from "react-router-dom";
function Signup() {
    const navigate = useNavigate();
    return (
        <>
        <div className="bg-color-grey">
        <form className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow flex flex-col border border-gray-300">
        <h1 className="text-3xl font-bold text-center mt-10">Sign Up Page</h1>
        <input
          type="text"
          name="username"
            placeholder="Username"
            className="border border-gray-300 rounded px-4 py-2 mt-4"
        />
        <input
          type="email"  
            name="email"
            placeholder="Email"
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
          Sign Up
        </button>
        <button
            type="submit"
            className="bg-gray-500 text-white rounded px-4 py-2 mt-4 hover:bg-gray-600"
            onClick={() => navigate("/")}

          >
            Back to Login
          </button>
      </form>
      </div>
      </>
    )
}
export default Signup;