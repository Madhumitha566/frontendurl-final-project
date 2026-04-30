import React from 'react';
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();

    // 1. Fix: Ensure the return and JSX are connected
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    {/* A nice spinner for a better user experience */}
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600 font-medium tracking-wide">Authenticating...</p>
                </div>
            </div>
        );
    }

    // 2. Logic: If the user is verified, show the page; otherwise, redirect to login
    return user ? children : <Navigate to="/login" />;
}

export default PrivateRoutes;
