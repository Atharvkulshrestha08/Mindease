import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, X, ShieldCheck } from 'lucide-react';
import Button from './Button';
import styles from './PremiumModal.module.css';

const PremiumModal = ({ isOpen, onClose, onUpgrade }) => {
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleProcess = () => {
        setIsProcessing(true);
        // Simulate payment gateway delay
        setTimeout(() => {
            setIsProcessing(false);
            onUpgrade();
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay}>
                    <motion.div
                        className={`${styles.modal} glass`}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    >
                        {!isProcessing ? (
                            <>
                                <button className={styles.closeBtn} onClick={onClose}>
                                    <X size={20} />
                                </button>

                                <div className={styles.badge}>FOUNDING MEMBER</div>

                                <h2>Unlock Spotify Integration</h2>
                                <p className={styles.description}>
                                    Seamlessly sync your personal playlists and heal through the music you love.
                                </p>

                                <div className={styles.priceContainer}>
                                    <span className={styles.currency}>₹</span>
                                    <span className={styles.price}>9</span>
                                    <span className={styles.period}>/lifetime</span>
                                </div>

                                <div className={styles.features}>
                                    <div className={styles.featureItem}>
                                        <Check size={18} color="var(--color-success)" />
                                        <span>Direct Spotify Library Sync</span>
                                    </div>
                                    <div className={styles.featureItem}>
                                        <Check size={18} color="var(--color-success)" />
                                        <span>Ad-free Healing Playlists</span>
                                    </div>
                                    <div className={styles.featureItem}>
                                        <Check size={18} color="var(--color-success)" />
                                        <span>Exclusive Sentient Soundscapes</span>
                                    </div>
                                </div>

                                <Button
                                    className={styles.upgradeBtn}
                                    onClick={handleProcess}
                                >
                                    <Zap size={18} />
                                    Upgrade Now
                                </Button>

                                <div className={styles.footer}>
                                    <ShieldCheck size={14} />
                                    <span>Secure one-time payment. Early access benefit.</span>
                                </div>
                            </>
                        ) : (
                            <div className={styles.processing}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Zap size={48} color="var(--color-accent)" />
                                </motion.div>
                                <h3>Processing Payment...</h3>
                                <p>Establishing secure connection to Spotify Gateway</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PremiumModal;
