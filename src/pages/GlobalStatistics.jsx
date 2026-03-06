import React from 'react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Globe, TrendingUp, Users, DollarSign, Activity, AlertCircle, Heart } from 'lucide-react';
import styles from './GlobalStatistics.module.css';
import { motion } from 'framer-motion';

const GlobalStatistics = () => {
    // Data remains the same for consistency but layout is cinematically upgraded
    const yearData = [
        { year: '1985', rate: 11.5 }, { year: '1986', rate: 11.7 }, { year: '1987', rate: 11.6 },
        { year: '1988', rate: 11.5 }, { year: '1989', rate: 13.1 }, { year: '1990', rate: 12.8 },
        { year: '1995', rate: 13.5 }, { year: '2000', rate: 12.9 }, { year: '2005', rate: 12.4 },
        { year: '2010', rate: 11.8 }, { year: '2015', rate: 11.4 },
    ];

    const ageData = [
        { age: '5-14', rate: 0.62 }, { age: '15-24', rate: 9.35 }, { age: '25-34', rate: 13.32 },
        { age: '35-54', rate: 17.06 }, { age: '55-74', rate: 18.84 }, { age: '75+', rate: 23.96 },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.heroHeader}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.pulseBadge}
                >
                    LIVE ANALYSIS
                </motion.div>
                <h1 className={styles.heroTitle}>The Global Pulse</h1>
                <p className={styles.heroSubtitle}>Visualize the impact. Feel the urgency. Change the narrative.</p>
            </header>

            <div className={styles.impactBaner}>
                <div className={styles.bannerItem}>
                    <h3>800,000+</h3>
                    <p>Lives lost annually</p>
                </div>
                <div className={styles.bannerDivider} />
                <div className={styles.bannerItem}>
                    <h3>Every 40s</h3>
                    <p>A tragic heartbeat</p>
                </div>
                <div className={styles.bannerDivider} />
                <div className={styles.bannerItem}>
                    <h3>MindEase Mission</h3>
                    <p>Turning data into hope</p>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Immersive Trend Chart */}
                <motion.div
                    className={`${styles.chartCard} ${styles.pulseCard}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.chartTitle}>
                        <Activity size={20} color="var(--color-danger)" />
                        The Rising Decades (Historical Trends)
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={yearData}>
                                <defs>
                                    <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(225, 45, 57, 0.1)" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: 'var(--box-shadow-hover)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="var(--color-danger)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorPulse)"
                                    name="Loss of Life/100k"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Age & Risk Distribution */}
                <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>
                        <Users size={20} />
                        Demographic Vulnerability
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={ageData}>
                                <XAxis dataKey="age" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                <Bar dataKey="rate" fill="var(--color-accent)" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gender comparison restored */}
                <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>
                        <Users size={20} color="var(--color-accent)" />
                        The Gender Gap
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={[
                                { name: 'Female', rate: 5.94, fill: 'var(--color-accent-light)' },
                                { name: 'Male', rate: 20.71, fill: 'var(--color-accent)' },
                            ]}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                <Bar dataKey="rate" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GDP Correlation restored */}
                <div className={`${styles.chartCard} ${styles.fullWidth}`}>
                    <div className={styles.chartTitle}>
                        <DollarSign size={20} color="var(--color-success)" />
                        Economic Correlation (GDP vs Risk)
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={[
                                { range: '0-100M', rate: 10.5 }, { range: '100M-1B', rate: 11.2 },
                                { range: '1B-10B', rate: 12.8 }, { range: '10B-100B', rate: 13.5 },
                                { range: '100B-1T', rate: 14.2 }, { range: '>1T', rate: 15.8 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '15px' }} />
                                <Line type="monotone" dataKey="rate" stroke="var(--color-success)" strokeWidth={4} dot={{ r: 6, fill: 'var(--color-success)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Generation vs Suicides restored */}
                <div className={`${styles.chartCard} ${styles.fullWidth}`}>
                    <div className={styles.chartTitle}>
                        <Activity size={20} color="var(--color-warning)" />
                        Generational Risk (Gen Z to Boomers)
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { name: 'Gen Z', rate: 0.64, fill: '#8884d8' },
                                { name: 'Millenials', rate: 5.85, fill: '#82ca9d' },
                                { name: 'Gen X', rate: 11.38, fill: '#ffc658' },
                                { name: 'Boomers', rate: 17.11, fill: '#ff7300' },
                                { name: 'G.I. Gen', rate: 23.99, fill: '#d0ed57' },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '15px' }} />
                                <Bar dataKey="rate" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={`${styles.chartCard} ${styles.ctaCard}`}>
                    <Heart size={48} color="white" />
                    <h3>Be the Solution</h3>
                    <p>Mindease is bridging the gap between data awareness and mental resilience.</p>
                </div>
            </div>
        </div>
    );
};

export default GlobalStatistics;
