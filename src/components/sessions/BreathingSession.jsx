import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../Button';
import styles from './Sessions.module.css';

const BreathingSession = () => {
    const [phase, setPhase] = useState('Ready'); // Ready, Inhale, Hold, Exhale
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setPhase('Ready');
            return;
        }

        const runCycle = async () => {
            // Inhale 4
            setPhase('Inhale');
            await new Promise(r => setTimeout(r, 4000));
            if (!isActive) return;
            // Hold 4
            setPhase('Hold');
            await new Promise(r => setTimeout(r, 4000));
            if (!isActive) return;
            // Exhale 6
            setPhase('Exhale');
            await new Promise(r => setTimeout(r, 6000));
            if (!isActive) return;

            // Loop functionality handled by useEffect re-triggering? 
            // No, need recursive or simple interval state but intervals are hard with variable times.

            // Actually, best way is likely animation variants controlling the timing, 
            // but for text phase updates we need JS sync.
            // Let's just recursively call a cycle function or use simple timeouts.
            // But React state updates in loop... 

            // Simpler approach: 
            // We need a loop that continues while isActive.
            // But we can't easily do "await" inside useEffect without care.
        };

        let timeoutId;
        const loop = () => {
            setPhase('Inhale');
            timeoutId = setTimeout(() => {
                setPhase('Hold');
                timeoutId = setTimeout(() => {
                    setPhase('Exhale');
                    timeoutId = setTimeout(() => {
                        loop();
                    }, 6000);
                }, 4000);
            }, 4000);
        };

        loop();

        return () => clearTimeout(timeoutId);
    }, [isActive]);

    return (
        <div className={styles.sessionContainer}>
            <h3 className={styles.sessionTitle}>Breathing (4-4-6)</h3>

            <motion.div
                className={styles.breathingCircle}
                animate={
                    isActive ? {
                        scale: [1, 1.5, 1.5, 1], // Inhale (grow), Hold (stay), Exhale (shrink)
                    } : { scale: 1 }
                }
                transition={
                    isActive ? {
                        duration: 14, // 4 + 4 + 6
                        times: [0, 0.285, 0.571, 1], // 4/14 ~= 0.285, 8/14 ~= 0.571
                        repeat: Infinity,
                        ease: "easeInOut"
                    } : {}
                }
            />

            <div className={styles.instruction}>
                {phase === 'Ready' && 'Ready to start?'}
                {phase === 'Inhale' && 'Inhale... (4s)'}
                {phase === 'Hold' && 'Hold... (4s)'}
                {phase === 'Exhale' && 'Exhale... (6s)'}
            </div>

            <Button onClick={() => setIsActive(!isActive)} variant={isActive ? "neutral" : "primary"}>
                {isActive ? "Stop" : "Start Breathing"}
            </Button>
        </div>
    );
};

export default BreathingSession;
