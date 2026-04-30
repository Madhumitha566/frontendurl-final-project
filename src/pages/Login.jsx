import { useState } from "react";
import axios from 'axios';
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import loginImg from "../assets/loginimage.png";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Fix: boolean
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("https://final-hostel-project-backend.onrender.com/api/auth/login", { email, password });
            
            if (response.data.success) {
                login(response.data.user);
                localStorage.setItem("token", response.data.token);
                
                const role = response.data.user.role;
                if (role === "Admin"){
                    navigate('/admin-dashboard');
                }
                else if (role === "Staff"){ 
                    navigate('/staff-dashboard');
                }
                else if(role==="Resident"){
                    navigate('/resident-dashboard');
                }else{
                    setError("Unauthorized role detected")
                }
            }
        } catch (err) {
            // Fix: Capture specific error message
            setError(err.response?.data?.error || "Server error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            {/* Main Page Title */}
            <h1 className="text-3xl font-bold text-indigo-600 mb-10 tracking-tight">
                Hostel Management System
            </h1>

            {/* Split Container: Flex-row for desktop, column for mobile */}
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Left Side: Image */}
                <div className="hidden md:flex md:w-1/2 bg-indigo-50 items-center justify-center p-12">
                    <img 
                        src={loginImg} 
                        alt="Login Illustration" 
                        className="w-full h-auto object-contain transform transition duration-500 hover:scale-105" 
                    />
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-8 lg:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                            <p className="text-gray-500 mt-2">Please enter your details to login</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter Your Password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white tracking-wide transition-all 
                            ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 active:scale-[0.98]'}`}
                        >
                            {loading ? "Verifying..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;