/* 
import { useEffect, useRef, useState } from "react"; 
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/authContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); 
  
  const effectRan = useRef(false);

  useEffect(() => {
    // 1. Auth Guard
    if (!user) {
      navigate("/login");
      return;
    }

    const verifyAndMarkAsPaid = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setStatus("error");
        return;
      }

      if (effectRan.current) return;
      effectRan.current = true;

      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.post('https://final-hostel-project-backend.onrender.com/api/billing/verify-success', 
          { sessionId }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          setStatus("success");

          // 2. Dynamic Navigation Logic based on user role
          const role = user.role?.toLowerCase()
          setTimeout(() => {
            if (user.role === 'Admin') {
              navigate("https://frontendurl-final-project.netlify.app/admin-dashboard/payments");
            } else {
              navigate("https://frontendurl-final-project.netlify.app/resident-dashboard/payments");
            }
          }, 3000); // 3 seconds is enough for the user to read the success message
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setStatus("error");
        effectRan.current = false; 
      }
    };

    verifyAndMarkAsPaid();
  }, [user, navigate, searchParams]);

  // Helper to handle manual button click if redirect fails
  const handleManualRedirect = () => {
    const path = user?.role === 'Admin' ? "https://frontendurl-final-project.netlify.app/admin-dashboard/payments" : "https://frontendurl-final-project.netlify.app/resident-dashboard/payments";
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-slate-50 font-sans">
      <div className="bg-white shadow-2xl shadow-indigo-100 rounded-[2.5rem] p-12 max-w-md w-full border border-slate-100">
        
        {status === "verifying" && (
          <div className="space-y-6">
            <Loader2 className="animate-spin text-indigo-600 mx-auto" size={60} />
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Verifying Payment</h1>
            <p className="text-slate-500 font-medium italic">Please don't refresh the page...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-emerald-500" size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Paid! 🎉</h1>
            <p className="text-slate-500 font-medium">Your records have been updated successfully.</p>
            <div className="pt-4">
               <p className="text-xs font-black text-indigo-400 uppercase tracking-widest animate-pulse">
                Redirecting to your dashboard...
               </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <XCircle className="text-rose-500 mx-auto" size={60} />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verification Failed</h1>
            <p className="text-slate-500 font-medium">We couldn't confirm your transaction. Please check your bank statement or contact support.</p>
            <button 
              onClick={handleManualRedirect}
              className="w-full mt-6 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess; */
import { useEffect, useRef, useState } from "react"; 
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/authContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
  // Destructure 'loading' if your context provides it to prevent premature redirects
  const { user, loading } = useAuth(); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); 
  
  const effectRan = useRef(false);

  useEffect(() => {
    // 1. Loading Guard: Wait for Auth to initialize
    if (loading) return;

    // 2. Auth Guard: Redirect if no user is found after loading
    if (!user) {
      navigate("/login");
      return;
    }

    const verifyAndMarkAsPaid = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setStatus("error");
        return;
      }

      // Prevent double-execution in React Strict Mode
      if (effectRan.current) return;
      effectRan.current = true;

      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.post('https://final-hostel-project-backend.onrender.com/api/billing/verify-success', 
          { sessionId }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          setStatus("success");

          // 3. Dynamic Navigation using INTERNAL paths
          setTimeout(() => {
            if (user.role === 'Admin') {
              navigate("/admin-dashboard/payments");
            } else {
              navigate("/resident-dashboard/payments");
            }
          }, 3000); 
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setStatus("error");
        // Reset ref so user can retry if it was a network glitch
        effectRan.current = false; 
      }
    };

    verifyAndMarkAsPaid();
  }, [user, loading, navigate, searchParams]);

  // Helper to handle manual button click using INTERNAL paths
  const handleManualRedirect = () => {
    const path = user?.role === 'Admin' 
      ? "/admin-dashboard/payments" 
      : "/resident-dashboard/payments";
    navigate(path);
  };

  // Show a spinner if the Auth state is still being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-slate-50 font-sans">
      <div className="bg-white shadow-2xl shadow-indigo-100 rounded-[2.5rem] p-12 max-w-md w-full border border-slate-100">
        
        {status === "verifying" && (
          <div className="space-y-6">
            <Loader2 className="animate-spin text-indigo-600 mx-auto" size={60} />
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Verifying Payment</h1>
            <p className="text-slate-500 font-medium italic">Please don't refresh the page...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-emerald-500" size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Paid! 🎉</h1>
            <p className="text-slate-500 font-medium">Your records have been updated successfully.</p>
            <div className="pt-4">
               <p className="text-xs font-black text-indigo-400 uppercase tracking-widest animate-pulse">
                Redirecting to your dashboard...
               </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <XCircle className="text-rose-500 mx-auto" size={60} />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verification Failed</h1>
            <p className="text-slate-500 font-medium">We couldn't confirm your transaction. Please check your bank statement or contact support.</p>
            <button 
              onClick={handleManualRedirect}
              className="w-full mt-6 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
 
