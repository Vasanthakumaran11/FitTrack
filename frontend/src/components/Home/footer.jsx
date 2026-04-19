function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
            <div className="container mx-auto px-6">
                <p>&copy; {new Date().getFullYear()} FitTrack. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;