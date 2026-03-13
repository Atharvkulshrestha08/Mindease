import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : false;
    });

    const [moodTheme, setMoodTheme] = useState(() => {
        return localStorage.getItem('moodTheme') || 'default';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-mood', moodTheme);
        localStorage.setItem('moodTheme', moodTheme);
    }, [moodTheme]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, moodTheme, setMoodTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
