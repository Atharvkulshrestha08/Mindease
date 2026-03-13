import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Smile, Frown, Meh, Activity, Zap, TrendingUp, Calendar, Compass, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import useLocalStorage from '../hooks/useLocalStorage';
import useAnimeOnMount from '../hooks/useAnimeOnMount';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { getCurrentActivity } from '../utils/wellnessPlan';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [moodLogs, setMoodLogs] = useLocalStorage('moodLogs', []);
    const { user } = useUser();
    const { setMoodTheme } = useTheme();
    const today = new Date().toISOString().split('T')[0];

    const todaysMood = useMemo(() => {
        return moodLogs.find(log => log.date === today)?.mood || null;
    }, [moodLogs, today]);

    const handleMoodSelect = (mood) => {
        const newLog = { date: today, mood, timestamp: new Date().toISOString() };
        const filteredLogs = moodLogs.filter(log => log.date !== today);
        setMoodLogs([...filteredLogs, newLog]);
        // Update mood-responsive theme
        setMoodTheme(mood);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const moodOptions = [
        { value: 'calm', label: 'Calm', icon: Smile, color: '#3EBD93' },
        { value: 'focused', label: 'Focused', icon: Zap, color: '#334E68' },
        { value: 'neutral', label: 'Neutral', icon: Meh, color: '#627D98' },
        { value: 'overwhelmed', label: 'Overwhelmed', icon: Activity, color: '#F1C40F' },
        { value: 'stressed', label: 'Stressed', icon: Frown, color: '#E12D39' },
    ];

    // Prepare data for chart (Last 7 days)
    const chartData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = moodLogs.find(l => l.date === dateStr);

            let score = 3;
            if (log) {
                if (log.mood === 'calm' || log.mood === 'focused') score = 5;
                if (log.mood === 'neutral') score = 3;
                if (log.mood === 'overwhelmed' || log.mood === 'stressed') score = 1;
            }

            data.push({ name: d.toLocaleDateString('en-US', { weekday: 'short' }), score, date: dateStr });
        }
        return data;
    }, [moodLogs]);

    // Streak Logic — real consecutive day calculation
    const streak = useMemo(() => {
        if (moodLogs.length === 0) return 0;

        const loggedDates = new Set(moodLogs.map(l => l.date));
        let currentStreak = 0;
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        const todayStr = todayDate.toISOString().split('T')[0];

        // Start checking from today, then go backwards
        let checkDate = new Date(todayDate);
        // If today isn't logged yet, check from yesterday
        if (!loggedDates.has(todayStr)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (loggedDates.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        return currentStreak;
    }, [moodLogs]);

    const getProactiveAdvice = () => {
        if (moodLogs.length < 3) return null;

        const lastThree = moodLogs.slice(-3);
        const stressCount = lastThree.filter(l => l.mood === 'stressed' || l.mood === 'overwhelmed').length;

        if (stressCount >= 2) {
            return {
                title: "Sentient Insight",
                text: "We noticed a pattern of high stress over the last 3 days. Would you like to try a deep 'Breathing Session' to reset?",
                type: 'alert'
            };
        }

        const calmCount = lastThree.filter(l => l.mood === 'calm' || l.mood === 'focused').length;
        if (calmCount >= 2) {
            return {
                title: "Momentum Alert",
                text: "You've been in a great flow lately! This is the perfect time to tackle a complex task or journal your gratitude.",
                type: 'positive'
            };
        }

        return null;
    };

    const proactiveAdvice = getProactiveAdvice();

    const getSuggestion = () => {
        if (!todaysMood) return { text: "Check in with yourself to get a personal suggestion.", action: null };

        if (proactiveAdvice && proactiveAdvice.type === 'alert') {
            return { text: proactiveAdvice.text, action: 'Breathe', path: '/app/sessions?type=breathing' };
        }

        if (todaysMood === 'stressed') return { text: "You're feeling stressed. Let's take a moment to breathe.", action: 'Breathing', path: '/app/sessions?type=breathing' };
        if (todaysMood === 'overwhelmed') return { text: "It's a lot right now. Unload your thoughts.", action: 'Journaling', path: '/app/journal' };
        if (todaysMood === 'focused') return { text: "Great focus! Leverage it with a timer.", action: 'Focus Timer', path: '/app/sessions?type=focus' };
        return { text: "Maintain your balance with a quick stretch.", action: 'Stretch', path: '/app/sessions?type=stretch' };
    };

    const suggestion = getSuggestion();

    // Staggered card entrance
    const gridRef = useAnimeOnMount(':scope > *', {
        staggerDelay: 100,
        duration: 600,
        translateY: 25,
        delay: 150,
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.greeting}>{getGreeting()}, {user?.name || 'there'} 💜</h2>
                    <p className={styles.subtext}>How are you feeling today? Take a moment — this space is yours.</p>
                </div>
                <div className={styles.streakBadge}>
                    <TrendingUp size={20} color="var(--color-accent)" />
                    <span>{streak} day streak</span>
                </div>
            </div>

            {/* "How are you?" — the first and most important thing */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', marginBottom: 'var(--spacing-lg)' }}
            >
                <Card title="How was your day?" className={styles.moodSection}>
                    <div className={styles.moodOptions}>
                        {moodOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleMoodSelect(option.value)}
                                className={`${styles.moodBtn} ${todaysMood === option.value ? styles.selectedMood : ''}`}
                                style={{ '--hover-color': option.color }}
                            >
                                <option.icon size={28} />
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Smart Reminder Banner */}
            {!todaysMood && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.reminderBanner}
                >
                    <AlertTriangle size={18} />
                    <span>We're here for you — tap above to check in 💛</span>
                </motion.div>
            )}

            <div className={styles.grid} ref={gridRef}>

                {/* Suggested Activity */}
                <Card title="Recommended for You" className={styles.suggestionCard}>
                    <p className={styles.suggestionText}>{suggestion.text}</p>
                    {suggestion.action && (
                        <Button onClick={() => navigate(suggestion.path)} className={styles.actionBtn}>
                            Start {suggestion.action}
                        </Button>
                    )}
                </Card>

                {/* Proactive Insight (New) */}
                {proactiveAdvice && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${styles.insightCard} ${proactiveAdvice.type === 'alert' ? styles.insightAlert : styles.insightPositive}`}
                    >
                        <Zap size={24} />
                        <div>
                            <h4>{proactiveAdvice.title}</h4>
                            <p>{proactiveAdvice.text}</p>
                        </div>
                    </motion.div>
                )}

                {/* Stress Trend Chart */}
                <Card title="Wellness Trend" className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#334E68" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#334E68" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#627D98', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide domain={[0, 6]} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        padding: '12px'
                                    }}
                                    cursor={{ stroke: '#334E68', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="var(--color-accent)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
