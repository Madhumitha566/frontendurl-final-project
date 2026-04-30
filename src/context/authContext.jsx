import { useContext, useState, createContext, useEffect } from "react";
import axios from 'axios';

const userContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://final-hostel-project-backend.onrender.com/api/auth/verify', {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log(response)
        if (response.data.success) {
          // This 'user' object now contains the role (Admin, Staff, or Resident)
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth Verification Error:", error);
        setUser(null);
        // If token is invalid or expired, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthContext;