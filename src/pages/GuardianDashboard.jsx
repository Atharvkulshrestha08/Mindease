import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, CloudSun, CloudRain, CloudLightning, Sun, Cloud, Heart, AlertTriangle, MessageSquare, Eye, EyeOff } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import styles from './GuardianDashboard.module.css';

const WEATHER_MAP = {
    sunny: { emoji: '☀️', label: 'Sunny', color: '#F59E0B', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' },
    partlyCloudy: { emoji: '⛅', label: 'Partly Cloudy', color: '#627D98', bg: 'linear-gradient(135deg, #E2E8F0, #CBD5E1)' },
    cloudy: { emoji: '☁️', label: 'Cloudy', color: '#94A3B8', bg: 'linear-gradient(135deg, #CBD5E1, #94A3B8)' },
    rainy: { emoji: '🌧️', label: 'Rainy', color: '#3B82F6', bg: 'linear-gradient(135deg, #BFDBFE, #93C5FD)' },
    stormy: { emoji: '⛈️', label: 'Stormy', color: '#E12D39', bg: 'linear-gradient(135deg, #FEE2E2, #FECACA)' },
};

const MOOD_TO_SCORE = {
    calm: 5,
    focused: 4,
    neutral: 3,
    overwhelmed: 2,
    stressed: 1,
};

const PARENT_TIPS = {
    sunny: {
        tip: "Your child is having a great stretch! This is a wonderful time to acknowledge their effort and celebrate small wins together.",
        do: [
            "Say: 'I've noticed you seem happier lately — that makes me happy too.'",
            "Offer a small reward: their favorite meal, a family outing, or just a hug.",
            "Ask about what's going well — but don't push.",
        ],
        avoid: [
            "Don't say: 'See, marks toh aa hi gaye when you try!'",
            "Don't add pressure by setting higher expectations now.",
            "Don't compare: 'Wish you were always like this.'",
        ],
    },
    partlyCloudy: {
        tip: "Normal emotional fluctuations. Your child is managing life's ups and downs. Just be present.",
        do: [
            "Say: 'How was your day?' and actually listen.",
            "Keep meals together — shared time matters more than deep talks.",
            "Respect their space if they want quiet time.",
        ],
        avoid: [
            "Don't probe: 'Kya hua? Kuch toh baat hai.'",
            "Don't assume silence means something is wrong.",
            "Don't start conversations with academics first.",
        ],
    },
    cloudy: {
        tip: "Your child might be going through a low phase. Gentle presence matters more than advice right now.",
        do: [
            "Make their favorite chai/snack without being asked.",
            "Say: 'I'm here if you want to talk, no pressure.'",
            "Send a supportive text if face-to-face feels awkward.",
        ],
        avoid: [
            "Don't say: 'Itna kya sochte ho? Humara time mein aisa nahi hota tha.'",
            "Don't share their situation with relatives.",
            "Don't compare with siblings or cousins.",
        ],
    },
    rainy: {
        tip: "High emotional pressure detected. Your child is struggling. Approach with warmth, not interrogation.",
        do: [
            "Say: 'I noticed you seem busy/tired — want to grab chai together?'",
            "Reduce household pressure: 'Don't worry about chores this week.'",
            "Start: 'Whatever it is, we'll figure it out together.'",
        ],
        avoid: [
            "Don't say: 'Log kya kahenge?' or bring up social pressure.",
            "Don't compare: 'Sharma ji ka beta toh...'",
            "Don't react with anger or frustration to their mood.",
        ],
    },
    stormy: {
        tip: "⚠️ Alert: Sustained stress pattern detected. Extended emotional difficulty needs your gentle, consistent support.",
        do: [
            "Have a calm one-on-one: 'I care about you more than any exam or job.'",
            "Offer professional help: 'Talking to someone isn't weakness — it's smart.'",
            "Reassure: 'Our love isn't conditional on your success.'",
        ],
        avoid: [
            "Don't panic or overreact — it will make them withdraw.",
            "Don't say: 'What do you have to be stressed about?'",
            "Don't discuss this with extended family or neighbors.",
        ],
    },
};

const GuardianDashboard = () => {
    const [moodLogs] = useLocalStorage('moodLogs', []);
    const [sleepLogs] = useLocalStorage('sleepLogs', []);

    // Get last 7 days of mood data
    const last7Days = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = moodLogs.find(l => l.date === dateStr);
            days.push({
                date: dateStr,
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                mood: log?.mood || null,
                score: log ? (MOOD_TO_SCORE[log.mood] || 3) : null,
            });
        }
        return days;
    }, [moodLogs]);

    // Calculate overall weather
    const overallWeather = useMemo(() => {
        const recentScores = last7Days.filter(d => d.score !== null).map(d => d.score);
        if (recentScores.length === 0) return 'partlyCloudy';

        const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        const stressCount = recentScores.filter(s => s <= 2).length;
        const hasSleepIssues = sleepLogs.length > 0 && sleepLogs.slice(-3).some(l => l.quality === 'poor');

        if (avg >= 4.2) return 'sunny';
        if (avg >= 3.5) return 'partlyCloudy';
        if (stressCount >= 3 && (hasSleepIssues || avg < 2)) return 'stormy';
        if (stressCount >= 2 || avg < 2.5) return 'rainy';
        if (avg >= 2.5) return 'cloudy';
        return 'partlyCloudy';
    }, [last7Days, sleepLogs]);

    // Day-to-weather mapping
    const dayWeather = (score) => {
        if (score === null) return { emoji: '·', label: 'No data' };
        if (score >= 4) return WEATHER_MAP.sunny;
        if (score >= 3) return WEATHER_MAP.partlyCloudy;
        if (score >= 2) return WEATHER_MAP.cloudy;
        return WEATHER_MAP.rainy;
    };

    const weather = WEATHER_MAP[overallWeather];
    const tips = PARENT_TIPS[overallWeather];

    // Temperature metaphor
    const tempMap = { sunny: 'Warm & Bright', partlyCloudy: 'Mild', cloudy: 'Cool', rainy: 'Chilly', stormy: 'Cold' };

    return (
        <div className={styles.container}>
            {/* Privacy Shield */}
            <motion.div
                className={styles.privacyBanner}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <EyeOff size={16} />
                <span>We share feelings, never words. Your child's privacy is sacred.</span>
            </motion.div>

            {/* Weather Hero */}
            <motion.div
                className={styles.weatherHero}
                style={{ background: weather.bg }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className={styles.weatherEmoji}>{weather.emoji}</div>
                <h1 className={styles.weatherLabel}>Emotional Weather: {weather.label}</h1>
                <p className={styles.tempLabel}>Emotional Temperature: {tempMap[overallWeather]}</p>
            </motion.div>

            {/* 7-Day Forecast */}
            <motion.div
                className={styles.forecastCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className={styles.cardTitle}>
                    <CloudSun size={20} />
                    7-Day Emotional Forecast
                </h3>
                <div className={styles.forecastStrip}>
                    {last7Days.map((day, i) => {
                        const w = dayWeather(day.score);
                        return (
                            <div key={day.date} className={styles.forecastDay}>
                                <span className={styles.dayLabel}>{day.day}</span>
                                <span className={styles.dayEmoji}>{w.emoji}</span>
                                <span className={styles.dayWeather}>{w.label}</span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Today's Tip */}
            <motion.div
                className={styles.tipCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className={styles.cardTitle}>
                    <Heart size={20} color="#E12D39" />
                    Today's Tip
                </h3>
                <p className={styles.tipText}>{tips.tip}</p>
            </motion.div>

            {/* Do's and Don'ts */}
            <div className={styles.dosDonts}>
                <motion.div
                    className={`${styles.dosCard} ${styles.doCard}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className={styles.cardTitle}>
                        <MessageSquare size={20} color="#3EBD93" />
                        What to Say & Do
                    </h3>
                    <ul className={styles.tipList}>
                        {tips.do.map((item, i) => (
                            <li key={i} className={styles.tipDo}>{item}</li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    className={`${styles.dosCard} ${styles.dontCard}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className={styles.cardTitle}>
                        <AlertTriangle size={20} color="#E12D39" />
                        Things to Avoid
                    </h3>
                    <ul className={styles.tipList}>
                        {tips.avoid.map((item, i) => (
                            <li key={i} className={styles.tipAvoid}>{item}</li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* Bottom Privacy Note */}
            <div className={styles.privacyNote}>
                <Shield size={16} />
                <p>
                    This dashboard reads emotional patterns — not conversations, not journal entries,
                    not any private content. We believe in bridging the generational gap with trust.
                </p>
            </div>
        </div>
    );
};

export default GuardianDashboard;
