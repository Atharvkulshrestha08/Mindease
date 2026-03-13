import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Calendar, BookOpen, Brain, Award, Activity, Download } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import useLocalStorage from '../hooks/useLocalStorage';
import { getAchievementProgress, getUnlockedAchievements, getLockedAchievements, ACHIEVEMENTS } from '../utils/achievements';
import { exportToJSON, exportToCSV } from '../utils/exportData';
import styles from './Analytics.module.css';

const MOOD_COLORS = {
    calm: '#3EBD93',
    focused: '#6366F1',
    neutral: '#627D98',
    overwhelmed: '#F59E0B',
    stressed: '#E12D39',
};

const Analytics = () => {
    const [moodLogs] = useLocalStorage('moodLogs', []);
    const [journalEntries] = useLocalStorage('journalEntries', []);
    const [sleepLogs] = useLocalStorage('sleepLogs', []);

    // Mood breakdown
    const moodBreakdown = useMemo(() => {
        const counts = {};
        moodLogs.forEach(l => {
            counts[l.mood] = (counts[l.mood] || 0) + 1;
        });
        return Object.entries(counts).map(([mood, count]) => ({
            name: mood.charAt(0).toUpperCase() + mood.slice(1),
            value: count,
            color: MOOD_COLORS[mood] || '#627D98',
        }));
    }, [moodLogs]);

    // Day of week analysis
    const dayAnalysis = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayScores = Array(7).fill(0);
        const dayCounts = Array(7).fill(0);

        moodLogs.forEach(l => {
            const dayIdx = new Date(l.date).getDay();
            dayCounts[dayIdx]++;
            if (l.mood === 'calm' || l.mood === 'focused') dayScores[dayIdx] += 5;
            else if (l.mood === 'neutral') dayScores[dayIdx] += 3;
            else dayScores[dayIdx] += 1;
        });

        return days.map((day, i) => ({
            day,
            score: dayCounts[i] > 0 ? Math.round((dayScores[i] / dayCounts[i]) * 10) / 10 : 0,
        }));
    }, [moodLogs]);

    // Monthly heatmap
    const heatmapData = useMemo(() => {
        const data = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = moodLogs.find(l => l.date === dateStr);
            let level = 0;
            if (log) {
                if (log.mood === 'calm' || log.mood === 'focused') level = 4;
                else if (log.mood === 'neutral') level = 2;
                else level = 1;
            }
            data.push({ date: dateStr, level, day: d.getDate() });
        }
        return data;
    }, [moodLogs]);

    // Wellness score
    const wellnessScore = useMemo(() => {
        if (moodLogs.length === 0) return 0;
        const recentLogs = moodLogs.slice(-14);
        let score = 50;
        recentLogs.forEach(l => {
            if (l.mood === 'calm') score += 4;
            if (l.mood === 'focused') score += 3;
            if (l.mood === 'neutral') score += 1;
            if (l.mood === 'overwhelmed') score -= 2;
            if (l.mood === 'stressed') score -= 3;
        });
        score += Math.min(journalEntries.length, 10) * 2;
        score += Math.min(sleepLogs.length, 10);
        return Math.min(100, Math.max(0, score));
    }, [moodLogs, journalEntries, sleepLogs]);

    // Achievement stats
    const stats = useMemo(() => {
        const loggedDates = new Set(moodLogs.map(l => l.date));
        let currentStreak = 0;
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        let checkDate = new Date(todayDate);
        const todayStr = todayDate.toISOString().split('T')[0];
        if (!loggedDates.has(todayStr)) checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (loggedDates.has(dateStr)) { currentStreak++; checkDate.setDate(checkDate.getDate() - 1); }
            else break;
        }

        // Calm streak
        let calmStreak = 0;
        const sortedLogs = [...moodLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
        for (const log of sortedLogs) {
            if (log.mood === 'calm') calmStreak++;
            else break;
        }

        const hasNightLog = moodLogs.some(l => {
            const h = new Date(l.timestamp).getHours();
            return h >= 22 || h < 5;
        });
        const hasEarlyLog = moodLogs.some(l => new Date(l.timestamp).getHours() < 7);

        return {
            totalMoodLogs: moodLogs.length,
            currentStreak,
            journalEntries: journalEntries.length,
            completedSessionTypes: 3,
            hasNightLog,
            hasEarlyLog,
            calmStreak,
            usedMusic: true,
            visitedStats: true,
        };
    }, [moodLogs, journalEntries]);

    const achievementProgress = getAchievementProgress(stats);
    const unlockedAchievements = getUnlockedAchievements(stats);
    const lockedAchievements = getLockedAchievements(stats);

    const levelColors = ['var(--color-bg-secondary)', '#e8f5e9', '#a5d6a7', '#66bb6a', '#2e7d32'];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.pageTitle}>Personal Analytics</h2>
                <div className={styles.exportBtns}>
                    <Button variant="outline" onClick={exportToJSON}>
                        <Download size={16} /> <span style={{ marginLeft: 6 }}>JSON</span>
                    </Button>
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download size={16} /> <span style={{ marginLeft: 6 }}>CSV</span>
                    </Button>
                </div>
            </div>

            {/* Score + Stats Row */}
            <div className={styles.scoreRow}>
                <Card className={styles.scoreCard}>
                    <div className={styles.scoreCircle}>
                        <svg viewBox="0 0 120 120" className={styles.scoreSvg}>
                            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-accent-light)" strokeWidth="8" />
                            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-accent)"
                                strokeWidth="8" strokeDasharray={`${wellnessScore * 3.27} 327`}
                                strokeLinecap="round" transform="rotate(-90 60 60)" />
                        </svg>
                        <div className={styles.scoreValue}>{wellnessScore}</div>
                    </div>
                    <div className={styles.scoreLabel}>Wellness Score</div>
                </Card>

                <Card className={styles.miniStat}>
                    <Calendar size={24} color="var(--color-accent)" />
                    <strong>{moodLogs.length}</strong>
                    <span>Mood Logs</span>
                </Card>
                <Card className={styles.miniStat}>
                    <BookOpen size={24} color="var(--color-success)" />
                    <strong>{journalEntries.length}</strong>
                    <span>Journal Entries</span>
                </Card>
                <Card className={styles.miniStat}>
                    <Activity size={24} color="var(--color-warning)" />
                    <strong>{sleepLogs.length}</strong>
                    <span>Sleep Logs</span>
                </Card>
            </div>

            {/* Heatmap */}
            <Card title="30-Day Mood Heatmap" className={styles.heatmapCard}>
                <div className={styles.heatmap}>
                    {heatmapData.map((d) => (
                        <div
                            key={d.date}
                            className={styles.heatCell}
                            style={{ background: levelColors[d.level] }}
                            title={`${d.date}: ${d.level === 0 ? 'No data' : d.level >= 3 ? 'Good' : d.level >= 2 ? 'Neutral' : 'Rough'}`}
                        >
                            {d.day}
                        </div>
                    ))}
                </div>
                <div className={styles.heatLegend}>
                    <span>Less</span>
                    {levelColors.map((c, i) => (
                        <div key={i} className={styles.legendDot} style={{ background: c }} />
                    ))}
                    <span>More</span>
                </div>
            </Card>

            <div className={styles.chartsGrid}>
                {/* Mood Breakdown Pie */}
                <Card title="Mood Distribution" className={styles.chartCard}>
                    {moodBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={moodBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                                    {moodBreakdown.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={styles.emptyText}>Log moods to see your distribution</p>
                    )}
                    <div className={styles.pieLegend}>
                        {moodBreakdown.map(m => (
                            <span key={m.name} className={styles.legendItem}>
                                <span className={styles.legendCircle} style={{ background: m.color }} />
                                {m.name} ({m.value})
                            </span>
                        ))}
                    </div>
                </Card>

                {/* Day of Week */}
                <Card title="Best Days of the Week" className={styles.chartCard}>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dayAnalysis}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 5]} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            <Bar dataKey="score" fill="var(--color-accent)" radius={[8, 8, 0, 0]} name="Avg Score" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Achievements */}
            <Card className={styles.achievementsCard}>
                <div className={styles.achHeader}>
                    <div>
                        <h3><Award size={20} /> Achievements</h3>
                        <span className={styles.achProgress}>{achievementProgress.unlocked}/{achievementProgress.total} unlocked ({achievementProgress.percentage}%)</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${achievementProgress.percentage}%` }} />
                    </div>
                </div>

                <div className={styles.badgeGrid}>
                    {unlockedAchievements.map(a => (
                        <div key={a.id} className={`${styles.badge} ${styles.badgeUnlocked}`}>
                            <span className={styles.badgeIcon}>{a.icon}</span>
                            <strong>{a.title}</strong>
                            <span>{a.description}</span>
                        </div>
                    ))}
                    {lockedAchievements.map(a => (
                        <div key={a.id} className={`${styles.badge} ${styles.badgeLocked}`}>
                            <span className={styles.badgeIcon}>🔒</span>
                            <strong>{a.title}</strong>
                            <span>{a.description}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
