import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../components/Card';
import MoodSelector from '../components/MoodSelector';
import useLocalStorage from '../hooks/useLocalStorage';
import styles from './Mood.module.css';

const Mood = () => {
    const [moodLogs, setMoodLogs] = useLocalStorage('moodLogs', []);
    const today = new Date().toISOString().split('T')[0];

    const todaysMood = useMemo(() => {
        return moodLogs.find(log => log.date === today)?.mood || null;
    }, [moodLogs, today]);

    const handleMoodSelect = (mood) => {
        const newLog = { date: today, mood, timestamp: new Date().toISOString() };
        const filteredLogs = moodLogs.filter(log => log.date !== today);
        setMoodLogs([...filteredLogs, newLog]);
    };

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

    // Sort logs by date desc for history
    const historyLogs = useMemo(() => {
        return [...moodLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [moodLogs]);

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Mood Tracking</h2>

            <div className={styles.grid}>
                <Card title="Today's Check-in" className={styles.checkInCard}>
                    <MoodSelector selectedMood={todaysMood} onSelect={handleMoodSelect} />
                </Card>

                <Card title="Weekly Trend" className={styles.chartCard}>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7F8C8D', fontSize: 12 }} dy={10} />
                                <YAxis hide domain={[0, 6]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#A9CCE3', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="var(--color-accent)"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "var(--color-accent)", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className={styles.historySection}>
                <h3 className={styles.historyTitle}>Recent History</h3>
                <div className={styles.historyList}>
                    {historyLogs.length === 0 && <p className={styles.emptyText}>No mood logs yet.</p>}
                    {historyLogs.map((log) => (
                        <div key={log.date} className={styles.historyItem}>
                            <span className={styles.historyDate}>{new Date(log.date).toLocaleDateString()}</span>
                            <span className={styles.historyMood} data-mood={log.mood}>{log.mood}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mood;
