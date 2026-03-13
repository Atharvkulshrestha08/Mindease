import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, X, ShieldCheck, CheckCircle, PartyPopper } from 'lucide-react';
import Button from './Button';
import styles from './PremiumModal.module.css';

const PremiumModal = ({ isOpen, onClose, onUpgrade }) => {
    const [stage, setStage] = React.useState('offer'); // 'offer' | 'processing' | 'success' | 'error'

    const handleProcess = () => {
        setStage('processing');
        // Simulate payment gateway delay
        setTimeout(() => {
            // 90% success rate for demo realism
            if (Math.random() > 0.1) {
                setStage('success');
                onUpgrade();
                // Auto-close after showing success
                setTimeout(() => {
                    setStage('offer');
                    onClose();
                }, 2500);
            } else {
                setStage('error');
            }
        }, 2200);
    };

    const handleRetry = () => {
        setStage('offer');
    };

    const handleClose = () => {
        setStage('offer');
        onClose();
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
                        {stage === 'offer' && (
                            <>
                                <button className={styles.closeBtn} onClick={handleClose}>
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
                        )}

                        {stage === 'processing' && (
                            <div className={styles.processing}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Zap size={48} color="var(--color-accent)" />
                                </motion.div>
                                <h3>Processing Payment...</h3>
                                <p>Establishing secure connection to Spotify Gateway</p>
                                <div className={styles.progressTrack}>
                                    <motion.div
                                        className={styles.progressFill}
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2, ease: 'easeInOut' }}
                                    />
                                </div>
                            </div>
                        )}

                        {stage === 'success' && (
                            <motion.div
                                className={styles.success}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                            >
                                <motion.div
                                    className={styles.successIcon}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2, damping: 8 }}
                                >
                                    <CheckCircle size={64} />
                                </motion.div>
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Welcome, Founding Member! 🎉
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    Spotify Integration is now unlocked. Your healing playlist awaits.
                                </motion.p>
                                <motion.div
                                    className={styles.confettiContainer}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {['🎵', '✨', '🎶', '💜', '🎧', '⚡'].map((emoji, i) => (
                                        <motion.span
                                            key={i}
                                            className={styles.confettiPiece}
                                            initial={{ y: 0, opacity: 1 }}
                                            animate={{
                                                y: [0, -60, 20],
                                                x: [(i - 2.5) * 20, (i - 2.5) * 40, (i - 2.5) * 30],
                                                opacity: [1, 1, 0],
                                            }}
                                            transition={{ duration: 2, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                                        >
                                            {emoji}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}

                        {stage === 'error' && (
                            <motion.div
                                className={styles.errorState}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <X size={48} color="var(--color-danger)" />
                                <h3>Payment Failed</h3>
                                <p>Something went wrong. Don't worry — no amount was charged.</p>
                                <Button onClick={handleRetry} className={styles.retryBtn}>
                                    Try Again
                                </Button>
                                <button className={styles.cancelLink} onClick={handleClose}>
                                    Cancel
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PremiumModal;
