import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import Button from '../../components/Button';

const meditations = [
    {
        id: 'body-scan',
        title: 'Body Scan',
        duration: 300,
        description: 'A calming body scan to release tension from head to toe.',
        steps: [
            { time: 0, text: 'Close your eyes and take a deep breath...' },
            { time: 20, text: 'Bring attention to the top of your head. Notice any tension...' },
            { time: 50, text: 'Move awareness to your forehead and eyes. Let them soften...' },
            { time: 80, text: 'Relax your jaw. Unclench your teeth...' },
            { time: 110, text: 'Feel your shoulders drop. Release the weight they carry...' },
            { time: 140, text: 'Notice your arms and hands. Let them feel heavy and warm...' },
            { time: 180, text: 'Breathe into your stomach. Let it rise and fall naturally...' },
            { time: 220, text: 'Bring attention to your legs. Feel them grounded...' },
            { time: 260, text: 'Notice your feet on the ground. Feel connected to the earth...' },
            { time: 280, text: 'Take a moment to appreciate your whole body...' },
            { time: 295, text: 'Gently open your eyes. You are refreshed.' },
        ],
        color: '#6366F1',
    },
    {
        id: 'gratitude',
        title: 'Gratitude Meditation',
        duration: 180,
        description: 'Cultivate gratitude and positive emotions.',
        steps: [
            { time: 0, text: 'Sit comfortably. Close your eyes...' },
            { time: 15, text: 'Think of one person you are grateful for...' },
            { time: 40, text: 'Picture their face. Feel warmth in your heart...' },
            { time: 65, text: 'Now think of one thing about today you appreciate...' },
            { time: 90, text: 'Even the smallest thing counts. Hold that feeling...' },
            { time: 120, text: 'Think of one quality about yourself you are proud of...' },
            { time: 150, text: 'Let gratitude fill your entire being...' },
            { time: 170, text: 'Slowly open your eyes. Carry this feeling with you.' },
        ],
        color: '#3EBD93',
    },
    {
        id: 'mindful-moment',
        title: 'Mindful Moment',
        duration: 120,
        description: 'A quick 2-minute reset for busy days.',
        steps: [
            { time: 0, text: 'Pause everything. Take 3 deep breaths...' },
            { time: 15, text: 'Notice 5 things you can see around you...' },
            { time: 35, text: 'Notice 4 things you can touch...' },
            { time: 55, text: 'Notice 3 things you can hear...' },
            { time: 70, text: 'Notice 2 things you can smell...' },
            { time: 85, text: 'Notice 1 thing you can taste...' },
            { time: 100, text: 'You are grounded. You are present. You are here.' },
            { time: 115, text: 'Take one last deep breath and continue your day.' },
        ],
        color: '#F59E0B',
    },
];

const styles = {
    container: { padding: '1rem 0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
    card: {
        padding: '1.5rem', borderRadius: 'var(--border-radius-md)', background: 'var(--color-bg-card)',
        border: '2px solid var(--color-accent-light)', cursor: 'pointer', transition: 'all 0.3s ease',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
    },
    cardTitle: { fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' },
    cardDesc: { fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 },
    cardDuration: { fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 600 },
    player: {
        padding: '2rem', borderRadius: 'var(--border-radius-lg)', background: 'var(--color-bg-card)',
        textAlign: 'center', boxShadow: 'var(--box-shadow-glass)',
    },
    breathCircle: {
        width: '180px', height: '180px', borderRadius: '50%', margin: '1.5rem auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.92rem', color: 'white', fontWeight: 500, lineHeight: 1.4,
        padding: '1.5rem', textAlign: 'center',
    },
    controls: { display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '1.5rem' },
    timer: { fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' },
    stepText: { fontSize: '1.1rem', color: 'var(--color-text-primary)', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' },
};

const MeditationSession = () => {
    const [selected, setSelected] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const intervalRef = useRef(null);

    const meditation = selected ? meditations.find(m => m.id === selected) : null;

    useEffect(() => {
        if (isPlaying && meditation) {
            intervalRef.current = setInterval(() => {
                setElapsed(prev => {
                    if (prev >= meditation.duration) {
                        clearInterval(intervalRef.current);
                        setIsPlaying(false);
                        return meditation.duration;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, meditation]);

    useEffect(() => {
        if (meditation) {
            for (let i = meditation.steps.length - 1; i >= 0; i--) {
                if (elapsed >= meditation.steps[i].time) {
                    setCurrentStep(i);
                    break;
                }
            }
        }
    }, [elapsed, meditation]);

    const handleSelect = (id) => {
        setSelected(id);
        setElapsed(0);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const reset = () => {
        setElapsed(0);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    if (meditation) {
        const progress = elapsed / meditation.duration;
        return (
            <div style={styles.container}>
                <div style={styles.player}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{meditation.title}</h3>

                    <motion.div
                        style={{
                            ...styles.breathCircle,
                            background: `linear-gradient(135deg, ${meditation.color}, ${meditation.color}88)`,
                        }}
                        animate={{
                            scale: isPlaying ? [1, 1.08, 1] : 1,
                        }}
                        transition={{
                            duration: 4,
                            repeat: isPlaying ? Infinity : 0,
                            ease: 'easeInOut',
                        }}
                    >
                        {meditation.steps[currentStep]?.text.slice(0, 60)}...
                    </motion.div>

                    <p style={styles.stepText}>{meditation.steps[currentStep]?.text}</p>

                    <div style={styles.timer}>
                        {formatTime(elapsed)} / {formatTime(meditation.duration)}
                    </div>

                    <div style={{ width: '100%', height: '4px', background: 'var(--color-accent-light)', borderRadius: '2px', marginBottom: '1rem' }}>
                        <div style={{ width: `${progress * 100}%`, height: '100%', background: meditation.color, borderRadius: '2px', transition: 'width 1s linear' }} />
                    </div>

                    <div style={styles.controls}>
                        <Button onClick={togglePlay}>
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            <span style={{ marginLeft: 8 }}>{isPlaying ? 'Pause' : 'Start'}</span>
                        </Button>
                        <Button variant="outline" onClick={reset}>
                            <RotateCcw size={18} />
                        </Button>
                        <Button variant="neutral" onClick={() => setSelected(null)}>
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>🧘 Guided Meditations</h3>
            <div style={styles.grid}>
                {meditations.map(m => (
                    <div key={m.id} style={{ ...styles.card, borderColor: m.color + '44' }} onClick={() => handleSelect(m.id)}>
                        <div style={styles.cardTitle}>{m.title}</div>
                        <div style={styles.cardDesc}>{m.description}</div>
                        <div style={{ ...styles.cardDuration, color: m.color }}>{Math.floor(m.duration / 60)} min</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeditationSession;
