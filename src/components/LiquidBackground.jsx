import React from 'react';
import { motion } from 'framer-motion';
import styles from './LiquidBackground.module.css';

const LiquidBackground = () => {
    return (
        <div className={styles.container}>
            <svg style={{ display: 'none' }}>
                <defs>
                    <filter id="liquid-filter">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                            result="liquid"
                        />
                    </filter>
                </defs>
            </svg>

            <div className={styles.blobLayer}>
                <motion.div
                    className={`${styles.blob} ${styles.blob1}`}
                    animate={{
                        x: [0, 100, -50, 0],
                        y: [0, -80, 100, 0],
                        scale: [1, 1.2, 0.9, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className={`${styles.blob} ${styles.blob2}`}
                    animate={{
                        x: [0, -120, 80, 0],
                        y: [0, 100, -60, 0],
                        scale: [1, 1.1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className={`${styles.blob} ${styles.blob3}`}
                    animate={{
                        x: [0, 70, -110, 0],
                        y: [0, -120, 90, 0],
                        scale: [1, 1.4, 0.8, 1],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
        </div>
    );
};

export default LiquidBackground;
