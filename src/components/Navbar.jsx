import { useAuth } from '../context/authContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    // Prevent error if user is null during logout transition
    if (!user) return null;

    return (
        /* Added 'sticky top-0 z-50' to keep it fixed at the top and above other elements */
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-5.5 bg-white backdrop-blur-md shadow-sm border-b border-indigo-100">
            
            {/* Branding / Logo Area */}
            <div className="flex  items-center gap-2 ml-2">
                <h3 className="text-indigo-900 text-sm sm:text-lg font-extrabold tracking-wider uppercase flex items-center">
                 Hostel   Management <span className="text-indigo-600 ml-3"> Portal</span>
                 
                </h3>
            </div>

            {/* Right Side: Welcome message and Logout */}
            <div className="flex items-center gap-6">
                <div className="hidden lg:flex flex-col items-end">
                    <p className="text-lg text-slate-700 font-bold leading-none mr-20">
                        Welcome, <span className="text-indigo-600">{user.name}</span>
                    </p>
                </div>
                <div>
                <button 
                    onClick={logout}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-black  tracking-widest shadow-lg shadow-indigo-100 "
                >
                    Logout
                </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;