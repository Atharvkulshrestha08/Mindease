import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import styles from './MainLayout.module.css';
import LiquidBackground from '../components/LiquidBackground';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <div className={styles.container}>
            <LiquidBackground />

            {/* Hamburger button — always visible */}
            <button
                className={styles.hamburger}
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
                <Menu size={24} />
            </button>

            {/* Overlay — click to close sidebar */}
            {sidebarOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className={`${styles.mainContent} ${sidebarOpen ? styles.mainShifted : ''}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
