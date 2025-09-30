import { useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, register as apiRegister, status } from "../../api/auth";
import type { ApiError, JWTPayload } from "../../types/api";
import { AuthContext } from "./useAuth";

// AuthProvider component to wrap around the app and provide auth state and functions
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<JWTPayload | null>(null);

    // Function to refresh user authentication status
    const refreshStatus = async () => {
        try {
            const res = await status();
            setUser(res.data.user);
        } catch (err) {
            setUser(null);

            const status = (err as ApiError).response?.status;
            if (status == 403) {
                console.warn("Your session has expired or is invalid, please log in again.");
            } else if (status !== 401) {
                console.error("An unexpected error occurred in status API call: ", err);
            }
        }
    };

    // Register function to create a new user and set the user state
    const register = async (email: string, password: string) => {
        try {
            const res = await apiRegister(email, password);    
            setUser(res.data.user); 
        } catch (err) {
            setUser(null);
            throw err;
        }
    };

    // Login function to authenticate user and set the user state
    const login = async (email: string, password: string) => {
        try {
            const res = await apiLogin(email, password);
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
            throw err;
        }
    };

    // Logout function to clear user state
    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    useEffect(() => {
        refreshStatus(); // check auth on first load
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, refreshStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

