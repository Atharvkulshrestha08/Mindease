import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('mindease_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('mindease_user', JSON.stringify(user));
        }
    }, [user]);

    const updateUser = (data) => {
        setUser(prev => ({ ...prev, ...data }));
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('mindease_user');
    };

    const isOnboarded = !!user?.name;

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser, isOnboarded }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
