function Navbar(){
    return(
        <nav className="bg-black text-white p-6 flex items-center justify-between">
            <h1 className="font-bold text-4xl pl-4">
                FitTrack
            </h1>
            <ul className="flex space-x-8 pr-4">
                <li className="hover:text-gray-300 cursor-pointer">Home</li>
                <li className="hover:text-gray-300 cursor-pointer">About</li>
                <li className="hover:text-gray-300 cursor-pointer">Contact</li>
            </ul>
        </nav>
    )
}
export default Navbar;