import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Smile, Coffee, BookOpen, LifeBuoy, RotateCw, Globe, Headphones, Gamepad2 } from 'lucide-react';
import styles from './Sidebar.module.css';
import clsx from 'clsx';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
        { icon: Smile, label: 'Mood', path: '/app/mood' },
        { icon: Coffee, label: 'Sessions', path: '/app/sessions' },
        { icon: BookOpen, label: 'Journal', path: '/app/journal' },
        { icon: RotateCw, label: 'Flashcards', path: '/app/flashcards' },
        { icon: Globe, label: 'Statistics', path: '/app/statistics' },
        { icon: Headphones, label: 'Music', path: '/app/music' },
        { icon: Gamepad2, label: 'Distractions', path: '/app/distractions' },
        { icon: LifeBuoy, label: 'Resources', path: '/app/resources' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <img src="/src/assets/logo.png" alt="MindEase Logo" style={{ height: 40 }} />
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(styles.navItem, isActive && styles.active)
                        }
                    >
                        <item.icon size={20} strokeWidth={2} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.footer}>
                <div className={styles.langSelector}>
                    <Globe size={16} />
                    <span>English (US)</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
