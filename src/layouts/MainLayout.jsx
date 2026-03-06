import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import styles from './MainLayout.module.css';

import LiquidBackground from '../components/LiquidBackground';

const MainLayout = () => {
    return (
        <div className={styles.container}>
            <LiquidBackground />
            <Sidebar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
