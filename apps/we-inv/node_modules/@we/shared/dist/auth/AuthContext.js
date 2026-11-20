import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Restore auth from localStorage
        const storedToken = localStorage.getItem('we_auth_token');
        const storedUser = localStorage.getItem('we_auth_user');
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                api.setToken(storedToken);
            }
            catch {
                localStorage.removeItem('we_auth_token');
                localStorage.removeItem('we_auth_user');
            }
        }
        setIsLoading(false);
    }, []);
    const login = async (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('we_auth_token', userToken);
        localStorage.setItem('we_auth_user', JSON.stringify(userData));
        api.setToken(userToken);
    };
    const logout = async () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('we_auth_token');
        localStorage.removeItem('we_auth_user');
        api.setToken(null);
    };
    const updateUser = (userData) => {
        if (user) {
            const updated = { ...user, ...userData };
            setUser(updated);
            localStorage.setItem('we_auth_user', JSON.stringify(updated));
        }
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            updateUser,
        }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
