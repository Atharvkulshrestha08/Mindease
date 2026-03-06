import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Heart, ArrowRight } from 'lucide-react';
import Button from './Button';
import styles from './ConsentModal.module.css';

const ConsentModal = ({ isOpen, onAccept, onDecline }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay}>
                    <motion.div
                        className={`${styles.modal} glass`}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <div className={styles.iconHeader}>
                            <div className={styles.iconCircle}>
                                <Database size={32} color="var(--color-success)" />
                            </div>
                        </div>

                        <h2>Building a Better Future</h2>
                        <p>
                            We're on a mission to revolutionize mental wellness. Would you like to share your anonymous insights to help us train our AI and improve the journey for students everywhere?
                        </p>

                        <div className={styles.benefits}>
                            <div className={styles.benefitItem}>
                                <Heart size={18} />
                                <span>Help us identify patterns of stress in real-time.</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <ArrowRight size={18} />
                                <span>Shape the future of personalized mental health.</span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                variant="outline"
                                onClick={onDecline}
                                className={styles.declineBtn}
                            >
                                No, Keep it Local
                            </Button>
                            <Button
                                onClick={onAccept}
                                className={styles.acceptBtn}
                            >
                                Yes, Count Me In!
                            </Button>
                        </div>

                        <p className={styles.disclaimer}>
                            All data is anonymized and used strictly for application development.
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConsentModal;
