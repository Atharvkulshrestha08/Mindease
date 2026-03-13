import React, { useState, useMemo } from 'react';
import { Moon, Sun, Star, Plus, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import useLocalStorage from '../hooks/useLocalStorage';
import styles from './SleepTracker.module.css';

const SleepTracker = () => {
    const [sleepLogs, setSleepLogs] = useLocalStorage('sleepLogs', []);
    const [bedtime, setBedtime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [quality, setQuality] = useState(3);
    const today = new Date().toISOString().split('T')[0];

    const todaysLog = useMemo(() => {
        return sleepLogs.find(l => l.date === today);
    }, [sleepLogs, today]);

    const handleSave = () => {
        const [bh, bm] = bedtime.split(':').map(Number);
        const [wh, wm] = wakeTime.split(':').map(Number);
        let hours = wh - bh;
        let mins = wm - bm;
        if (hours < 0) hours += 24;
        if (mins < 0) { hours -= 1; mins += 60; }
        const duration = hours + (mins / 60);

        const log = {
            date: today,
            bedtime,
            wakeTime,
            quality,
            duration: Math.round(duration * 10) / 10,
            timestamp: new Date().toISOString(),
        };

        const filtered = sleepLogs.filter(l => l.date !== today);
        setSleepLogs([...filtered, log]);
    };

    const chartData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = sleepLogs.find(l => l.date === dateStr);
            data.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                hours: log ? log.duration : 0,
                quality: log ? log.quality : 0,
            });
        }
        return data;
    }, [sleepLogs]);

    const weeklyAvg = useMemo(() => {
        const weekLogs = sleepLogs.filter(l => {
            const d = new Date(l.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return d >= weekAgo;
        });
        if (weekLogs.length === 0) return { hours: 0, quality: 0 };
        const avgHours = weekLogs.reduce((s, l) => s + l.duration, 0) / weekLogs.length;
        const avgQuality = weekLogs.reduce((s, l) => s + l.quality, 0) / weekLogs.length;
        return { hours: Math.round(avgHours * 10) / 10, quality: Math.round(avgQuality * 10) / 10 };
    }, [sleepLogs]);

    const qualityLabels = ['', 'Poor', 'Below Avg', 'Average', 'Good', 'Excellent'];

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Sleep Tracker</h2>

            <div className={styles.statsRow}>
                <Card className={styles.statCard}>
                    <Moon size={24} color="var(--color-accent)" />
                    <div className={styles.statValue}>{weeklyAvg.hours}h</div>
                    <div className={styles.statLabel}>Weekly Avg Sleep</div>
                </Card>
                <Card className={styles.statCard}>
                    <Star size={24} color="var(--color-warning)" />
                    <div className={styles.statValue}>{weeklyAvg.quality}/5</div>
                    <div className={styles.statLabel}>Avg Quality</div>
                </Card>
                <Card className={styles.statCard}>
                    <TrendingUp size={24} color="var(--color-success)" />
                    <div className={styles.statValue}>{sleepLogs.length}</div>
                    <div className={styles.statLabel}>Total Logs</div>
                </Card>
            </div>

            <div className={styles.grid}>
                <Card title={todaysLog ? "Today's Sleep (Logged ✓)" : "Log Tonight's Sleep"} className={styles.logCard}>
                    <div className={styles.timeInputs}>
                        <div className={styles.timeField}>
                            <Moon size={18} />
                            <label>Bedtime</label>
                            <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className={styles.timeInput} />
                        </div>
                        <div className={styles.timeField}>
                            <Sun size={18} />
                            <label>Wake Time</label>
                            <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className={styles.timeInput} />
                        </div>
                    </div>

                    <div className={styles.qualitySection}>
                        <label>Sleep Quality</label>
                        <div className={styles.qualityStars}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <button
                                    key={n}
                                    className={`${styles.starBtn} ${n <= quality ? styles.starActive : ''}`}
                                    onClick={() => setQuality(n)}
                                >
                                    <Star size={28} fill={n <= quality ? 'var(--color-warning)' : 'none'} color={n <= quality ? 'var(--color-warning)' : 'var(--color-text-secondary)'} />
                                </button>
                            ))}
                        </div>
                        <span className={styles.qualityLabel}>{qualityLabels[quality]}</span>
                    </div>

                    <Button onClick={handleSave}>
                        <Plus size={18} />
                        <span style={{ marginLeft: 8 }}>{todaysLog ? 'Update Log' : 'Save Sleep Log'}</span>
                    </Button>
                </Card>

                <Card title="Weekly Sleep Duration" className={styles.chartCard}>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--box-shadow-hover)' }} />
                                <Bar dataKey="hours" fill="var(--color-accent)" radius={[8, 8, 0, 0]} name="Hours Slept" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className={styles.tips}>
                <Card className={styles.tipCard}>
                    <h4>💡 Sleep Tips</h4>
                    <ul>
                        <li>Maintain a consistent sleep schedule — even on weekends</li>
                        <li>Avoid screens 30 minutes before bed</li>
                        <li>Keep your room cool (18-20°C) and dark</li>
                        <li>Limit caffeine after 2 PM</li>
                        <li>Try the MindEase breathing exercise before bed</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default SleepTracker;
