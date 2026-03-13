import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Smile, Coffee, BookOpen, LifeBuoy,
    RotateCw, Globe, Headphones, Gamepad2, Bot, Moon,
    Sun, BarChart3, BedDouble, Flame, ShieldCheck, X
} from 'lucide-react';
import styles from './Sidebar.module.css';
import logo from '../assets/logo.png';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { isDark, toggleTheme } = useTheme();

    const navItems = [
        { icon: Flame, label: 'Vent', path: '/app/vent' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
        { icon: Smile, label: 'Mood', path: '/app/mood' },
        { icon: Coffee, label: 'Sessions', path: '/app/sessions' },
        { icon: BookOpen, label: 'Journal', path: '/app/journal' },
        { icon: Bot, label: 'Buddy', path: '/app/chatbot' },
        { icon: BedDouble, label: 'Sleep', path: '/app/sleep' },
        { icon: RotateCw, label: 'Flashcards', path: '/app/flashcards' },
        { icon: Globe, label: 'Statistics', path: '/app/statistics' },
        { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
        { icon: Headphones, label: 'Music', path: '/app/music' },
        { icon: Gamepad2, label: 'Distractions', path: '/app/distractions' },
        { icon: ShieldCheck, label: 'Guardian', path: '/app/guardian' },
        { icon: LifeBuoy, label: 'Resources', path: '/app/resources' },
    ];

    return (
        <aside className={clsx(styles.sidebar, isOpen && styles.sidebarOpen)}>
            {/* Close button — mobile only */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
                <X size={22} />
            </button>

            <div className={styles.logo}>
                <img src={logo} alt="MindEase Logo" style={{ height: 40 }} />
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(styles.navItem, isActive && styles.active)
                        }
                        onClick={onClose}
                    >
                        <item.icon size={20} strokeWidth={2} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.footer}>
                <button className={styles.themeToggle} onClick={toggleTheme}>
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
