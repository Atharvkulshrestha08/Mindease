import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate } from 'animejs';
import { Flame, Shield, Volume2, SmilePlus, Meh, MessageCircle, Lock, Trash2, Wind } from 'lucide-react';
import styles from './VentSpace.module.css';

const VentSpace = () => {
    const [ventText, setVentText] = useState('');
    const [phase, setPhase] = useState('vent'); // 'vent' | 'burning' | 'released' | 'reflect'
    const [ventCount, setVentCount] = useState(() => {
        return parseInt(localStorage.getItem('ventCount') || '0', 10);
    });
    const [isListening, setIsListening] = useState(false);
    const textareaRef = useRef(null);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);

    useEffect(() => {
        if (phase === 'vent' && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [phase]);

    // Canvas particle burn effect
    const spawnBurnParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;
        const PARTICLE_COUNT = 60;

        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: W / 2 + (Math.random() - 0.5) * 200,
            y: H * 0.6 + Math.random() * 40,
            size: 3 + Math.random() * 5,
            opacity: 0,
            vx: (Math.random() - 0.5) * 2,
            targetY: -20 - Math.random() * H * 0.4,
        }));

        // Animate each particle with anime.js
        particles.forEach((p, i) => {
            const delay = Math.random() * 800;
            const duration = 1200 + Math.random() * 800;
            animate(p, {
                y: p.targetY,
                x: p.x + (Math.random() - 0.5) * 120,
                size: 0,
                opacity: [0, 0.9, 0.6, 0],
                duration,
                delay,
                easing: 'easeOutQuad',
            });
        });

        // Draw loop
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach((p) => {
                if (p.opacity <= 0) return;
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
                gradient.addColorStop(0, `rgba(255, 107, 53, ${p.opacity})`);
                gradient.addColorStop(0.5, `rgba(225, 45, 57, ${p.opacity * 0.6})`);
                gradient.addColorStop(1, `rgba(225, 45, 57, 0)`);
                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                ctx.fill();
            });
            animFrameRef.current = requestAnimationFrame(draw);
        };
        draw();
    }, []);

    // Trigger particles on burning phase
    useEffect(() => {
        if (phase === 'burning') {
            spawnBurnParticles();
        } else {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        }
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [phase, spawnBurnParticles]);

    const handleBurn = () => {
        if (!ventText.trim()) return;
        setPhase('burning');

        setTimeout(() => {
            setPhase('released');
            setVentText('');
            const newCount = ventCount + 1;
            setVentCount(newCount);
            localStorage.setItem('ventCount', String(newCount));

            setTimeout(() => {
                setPhase('reflect');
            }, 1800);
        }, 2000);
    };

    const handleReflection = (feeling) => {
        if (feeling === 'more') {
            // Could navigate to chatbot, for now just reset
            window.location.href = '/app/chatbot';
        } else {
            setPhase('vent');
        }
    };

    const handleVoiceVent = () => {
        setIsListening(prev => !prev);
        // No actual recording — just cathartic animation
        if (!isListening) {
            setTimeout(() => setIsListening(false), 8000);
        }
    };

    const resetVent = () => {
        setVentText('');
        setPhase('vent');
    };

    return (
        <div className={styles.container}>
            {/* Ambient particles */}
            <div className={styles.particles}>
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={styles.particle}
                        animate={{
                            y: [0, -100, -200],
                            opacity: [0.3, 0.6, 0],
                            x: [0, (Math.random() - 0.5) * 60],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                        style={{
                            left: `${10 + Math.random() * 80}%`,
                            bottom: '10%',
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.privacyBadge}>
                    <Lock size={14} />
                    Nothing is saved. Nothing is tracked.
                </div>
                <h1 className={styles.title}>
                    <Flame size={32} className={styles.flameIcon} />
                    Scream Into the Void
                </h1>
                <p className={styles.subtitle}>
                    No judgments. No records. Just release.
                </p>
            </motion.div>

            {/* Main Area */}
            <div className={styles.mainArea}>
                <AnimatePresence mode="wait">
                    {phase === 'vent' && (
                        <motion.div
                            key="vent"
                            className={styles.ventArea}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <textarea
                                ref={textareaRef}
                                className={styles.ventTextarea}
                                placeholder="Let it all out... Say whatever you need to say. Scream, rant, cry — this space is yours. Every word disappears the moment you let go."
                                value={ventText}
                                onChange={(e) => setVentText(e.target.value)}
                                rows={8}
                            />

                            <div className={styles.actionRow}>
                                <button
                                    className={`${styles.voiceBtn} ${isListening ? styles.voiceActive : ''}`}
                                    onClick={handleVoiceVent}
                                    title="Voice Vent — just let it out"
                                >
                                    <Volume2 size={20} />
                                    {isListening ? 'Listening...' : 'Voice Vent'}
                                </button>

                                <button
                                    className={styles.burnBtn}
                                    onClick={handleBurn}
                                    disabled={!ventText.trim()}
                                >
                                    <Flame size={20} />
                                    Let It Go 🔥
                                </button>
                            </div>

                            {isListening && (
                                <motion.div
                                    className={styles.waveform}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className={styles.waveBar}
                                            animate={{
                                                height: [8, 15 + Math.random() * 30, 8],
                                            }}
                                            transition={{
                                                duration: 0.4 + Math.random() * 0.4,
                                                repeat: Infinity,
                                                delay: i * 0.05,
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}

                            <p className={styles.charHint}>
                                {ventText.length > 0
                                    ? `${ventText.length} characters of pure honesty`
                                    : 'Start typing or use your voice...'}
                            </p>
                        </motion.div>
                    )}

                    {phase === 'burning' && (
                        <motion.div
                            key="burning"
                            className={styles.burningArea}
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                        >
                            {/* Canvas particle fire burst */}
                            <canvas ref={canvasRef} className={styles.burnCanvas} />

                            <motion.div
                                className={styles.burningText}
                                initial={{ opacity: 1, filter: 'blur(0px)' }}
                                animate={{
                                    opacity: [1, 0.6, 0.3, 0],
                                    filter: ['blur(0px)', 'blur(2px)', 'blur(6px)', 'blur(20px)'],
                                    y: [0, -20, -50, -100],
                                    scale: [1, 0.98, 0.95, 0.8],
                                }}
                                transition={{ duration: 2, ease: 'easeOut' }}
                            >
                                <p>{ventText}</p>
                            </motion.div>
                            <motion.div
                                className={styles.burnEmbers}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2 }}
                            >
                                {['🔥', '✨', '💨', '🕊️'].map((e, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{
                                            y: [-20, -80 - Math.random() * 60],
                                            x: [(i - 1.5) * 30, (i - 1.5) * 50],
                                            opacity: [1, 0],
                                        }}
                                        transition={{ duration: 1.5, delay: 0.3 + i * 0.2 }}
                                        style={{ fontSize: '2rem', position: 'absolute' }}
                                    >
                                        {e}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {phase === 'released' && (
                        <motion.div
                            key="released"
                            className={styles.releasedArea}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', damping: 12 }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                            >
                                <Wind size={64} className={styles.releaseIcon} />
                            </motion.div>
                            <h2>Gone. Forever.</h2>
                            <p>Your words have dissolved into the void. They no longer exist.</p>
                        </motion.div>
                    )}

                    {phase === 'reflect' && (
                        <motion.div
                            key="reflect"
                            className={styles.reflectArea}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2>How do you feel now?</h2>
                            <div className={styles.reflectOptions}>
                                <button
                                    className={styles.reflectBtn}
                                    onClick={() => handleReflection('lighter')}
                                >
                                    <SmilePlus size={32} />
                                    <span>Lighter 😮‍💨</span>
                                </button>
                                <button
                                    className={styles.reflectBtn}
                                    onClick={() => handleReflection('same')}
                                >
                                    <Meh size={32} />
                                    <span>Same 😐</span>
                                </button>
                                <button
                                    className={`${styles.reflectBtn} ${styles.reflectMore}`}
                                    onClick={() => handleReflection('more')}
                                >
                                    <MessageCircle size={32} />
                                    <span>Need More 💬</span>
                                </button>
                            </div>
                            <p className={styles.reflectHint}>
                                "Need More" will take you to our Companion — a safe, private space to talk.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer stats */}
            {ventCount > 0 && (
                <motion.div
                    className={styles.ventStats}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Shield size={14} />
                    You've released {ventCount} time{ventCount !== 1 ? 's' : ''}. All destroyed. All forgotten.
                </motion.div>
            )}
        </div>
    );
};

export default VentSpace;
