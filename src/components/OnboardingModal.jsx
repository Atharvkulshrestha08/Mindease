import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Target, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import styles from './OnboardingModal.module.css';

const goals = [
    { id: 'stress', label: 'Reduce Stress', icon: '🧘' },
    { id: 'focus', label: 'Improve Focus', icon: '🎯' },
    { id: 'sleep', label: 'Better Sleep', icon: '😴' },
    { id: 'anxiety', label: 'Manage Anxiety', icon: '💆' },
    { id: 'mood', label: 'Track My Mood', icon: '📊' },
    { id: 'mindful', label: 'Be More Mindful', icon: '🌿' },
];

const timeOptions = [
    { id: '5', label: '5 minutes', desc: 'Quick daily check-in' },
    { id: '15', label: '15 minutes', desc: 'Balanced routine' },
    { id: '30', label: '30 minutes', desc: 'Deep wellness practice' },
];

const OnboardingModal = ({ isOpen, onComplete }) => {
    const { updateUser } = useUser();
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [dailyTime, setDailyTime] = useState('15');

    if (!isOpen) return null;

    const toggleGoal = (id) => {
        setSelectedGoals(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const handleComplete = () => {
        updateUser({
            name: name.trim() || 'Friend',
            goals: selectedGoals,
            dailyTime,
            onboardedAt: new Date().toISOString(),
        });
        onComplete();
    };

    const steps = [
        // Step 0: Name
        <motion.div key="name" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className={styles.stepContent}>
            <div className={styles.stepIcon}><User size={48} /></div>
            <h2>Welcome to MindEase</h2>
            <p className={styles.stepDesc}>Let's personalize your experience. What should we call you?</p>
            <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.nameInput}
                autoFocus
            />
            <button className={styles.nextBtn} onClick={() => setStep(1)} disabled={!name.trim()}>
                Continue <ArrowRight size={18} />
            </button>
        </motion.div>,

        // Step 1: Goals
        <motion.div key="goals" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className={styles.stepContent}>
            <div className={styles.stepIcon}><Target size={48} /></div>
            <h2>What are your goals?</h2>
            <p className={styles.stepDesc}>Select all that apply. This helps us tailor your experience.</p>
            <div className={styles.goalGrid}>
                {goals.map(goal => (
                    <button
                        key={goal.id}
                        className={`${styles.goalChip} ${selectedGoals.includes(goal.id) ? styles.goalSelected : ''}`}
                        onClick={() => toggleGoal(goal.id)}
                    >
                        <span className={styles.goalIcon}>{goal.icon}</span>
                        <span>{goal.label}</span>
                    </button>
                ))}
            </div>
            <button className={styles.nextBtn} onClick={() => setStep(2)} disabled={selectedGoals.length === 0}>
                Continue <ArrowRight size={18} />
            </button>
        </motion.div>,

        // Step 2: Daily Time
        <motion.div key="time" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className={styles.stepContent}>
            <div className={styles.stepIcon}><Clock size={48} /></div>
            <h2>How much time per day?</h2>
            <p className={styles.stepDesc}>We'll build your daily plan around this.</p>
            <div className={styles.timeOptions}>
                {timeOptions.map(opt => (
                    <button
                        key={opt.id}
                        className={`${styles.timeChip} ${dailyTime === opt.id ? styles.timeSelected : ''}`}
                        onClick={() => setDailyTime(opt.id)}
                    >
                        <strong>{opt.label}</strong>
                        <span>{opt.desc}</span>
                    </button>
                ))}
            </div>
            <button className={styles.nextBtn} onClick={handleComplete}>
                <Sparkles size={18} /> Start Your Journey
            </button>
        </motion.div>,
    ];

    return (
        <div className={styles.overlay}>
            <motion.div
                className={styles.modal}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className={styles.progress}>
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`${styles.progressDot} ${step >= i ? styles.progressActive : ''}`} />
                    ))}
                </div>
                <AnimatePresence mode="wait">
                    {steps[step]}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default OnboardingModal;
