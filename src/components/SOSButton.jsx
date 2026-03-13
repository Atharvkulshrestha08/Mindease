import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Wind, Phone, X, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './SOSButton.module.css';

const SOSButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleBreathing = () => {
        setIsOpen(false);
        navigate('/app/sessions?type=breathing');
    };

    const handleMusic = () => {
        setIsOpen(false);
        navigate('/app/music');
    };

    const handleResources = () => {
        setIsOpen(false);
        navigate('/app/resources');
    };

    return (
        <>
            <motion.button
                className={styles.sosBtn}
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ['0 0 0 0 rgba(225, 45, 57, 0.4)', '0 0 0 12px rgba(225, 45, 57, 0)', '0 0 0 0 rgba(225, 45, 57, 0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                title="SOS — Immediate Help"
            >
                <AlertCircle size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.panel}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50 }}
                        >
                            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                                <X size={20} />
                            </button>

                            <div className={styles.header}>
                                <AlertCircle size={36} color="var(--color-danger)" />
                                <h2>You're Not Alone</h2>
                                <p>Take a deep breath. Help is here.</p>
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.actionCard} onClick={handleBreathing}>
                                    <Wind size={28} />
                                    <div>
                                        <strong>Breathe Now</strong>
                                        <span>Start calming exercises</span>
                                    </div>
                                </button>

                                <button className={styles.actionCard} onClick={handleMusic}>
                                    <Volume2 size={28} />
                                    <div>
                                        <strong>Calming Sounds</strong>
                                        <span>Listen to soothing melodies</span>
                                    </div>
                                </button>

                                <button className={`${styles.actionCard} ${styles.emergency}`} onClick={handleResources}>
                                    <Phone size={28} />
                                    <div>
                                        <strong>Emergency Helplines</strong>
                                        <span>Talk to someone now</span>
                                    </div>
                                </button>
                            </div>

                            <p className={styles.disclaimer}>
                                If you are in immediate danger, call emergency services (112 / 911) now.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SOSButton;
