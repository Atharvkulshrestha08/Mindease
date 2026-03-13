import React, { useState, useEffect, useRef } from 'react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    Cell, PieChart, Pie
} from 'recharts';
import { Globe, TrendingUp, Users, Activity, AlertCircle, Heart, Brain, BarChart3, PieChart as PieIcon, Eye } from 'lucide-react';
import styles from './GlobalStatistics.module.css';
import { motion } from 'framer-motion';
import { animate } from 'animejs';

import {
    globalPrevalenceTrend,
    globalBurdenTrend,
    topCountriesDepression2019,
    topCountriesAnxiety2019,
    depressionResearchCoverage,
    anxietyTreatmentGap,
    usDepressiveSymptoms,
    countriesWithPrimaryData,
} from '../data/mentalHealthData';

const DISORDER_COLORS = {
    depression: '#E12D39',
    anxiety: '#F59E0B',
    schizophrenia: '#6366F1',
    bipolar: '#3EBD93',
    eating: '#EC4899',
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
        <div className={styles.customTooltip}>
            <p className={styles.tooltipLabel}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }}>
                    {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}%</strong>
                </p>
            ))}
        </div>
    );
};

const DALYsTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
        <div className={styles.customTooltip}>
            <p className={styles.tooltipLabel}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }}>
                    {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong> per 100k
                </p>
            ))}
        </div>
    );
};

const SectionDivider = ({ icon: Icon, title, subtitle }) => (
    <motion.div
        className={styles.sectionDivider}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
    >
        <Icon size={24} className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>{title}</h2>
        {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
    </motion.div>
);

const GlobalStatistics = () => {
    const [activePrevalenceDisorder, setActivePrevalenceDisorder] = useState('all');
    const [activeBurdenDisorder, setActiveBurdenDisorder] = useState('all');

    // Animated impact banner counters
    const bannerRef = useRef(null);
    const bannerAnimated = useRef(false);

    useEffect(() => {
        if (!bannerRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !bannerAnimated.current) {
                        bannerAnimated.current = true;
                        const countEls = bannerRef.current.querySelectorAll('[data-count-target]');
                        countEls.forEach((el) => {
                            const target = parseFloat(el.dataset.countTarget);
                            const prefix = el.dataset.countPrefix || '';
                            const suffix = el.dataset.countSuffix || '';
                            const decimals = el.dataset.countDecimals ? parseInt(el.dataset.countDecimals) : 0;
                            const obj = { value: 0 };
                            animate(obj, {
                                value: target,
                                duration: 1800,
                                easing: 'easeOutExpo',
                                onUpdate: () => {
                                    el.textContent = prefix + obj.value.toFixed(decimals) + suffix;
                                },
                            });
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );
        observer.observe(bannerRef.current);
        return () => observer.disconnect();
    }, []);

    // Filter sorted treatment gap data — show only country-level entries (not income groups)
    const treatmentGapSorted = [...anxietyTreatmentGap]
        .filter(d => !d.country.includes('income') && !d.country.includes('High-'))
        .sort((a, b) => b.untreated - a.untreated)
        .slice(0, 15);

    // Sort research coverage descending, filter out zeros
    const researchCoverageSorted = [...depressionResearchCoverage]
        .filter(d => d.coverage > 0)
        .sort((a, b) => b.coverage - a.coverage);

    // Countries with primary data sorted
    const countriesDataSorted = [...countriesWithPrimaryData].sort((a, b) => b.countries - a.countries);

    // Symptoms – compute "affected" percentage (everything except "notAtAll")
    const symptomsWithAffected = usDepressiveSymptoms.map(s => ({
        ...s,
        affected: +(s.nearlyEveryDay + s.moreThanHalf + s.severalDays).toFixed(1),
    })).sort((a, b) => b.affected - a.affected);

    const disorderTabs = [
        { key: 'all', label: 'All Disorders' },
        { key: 'depression', label: 'Depression', color: DISORDER_COLORS.depression },
        { key: 'anxiety', label: 'Anxiety', color: DISORDER_COLORS.anxiety },
        { key: 'schizophrenia', label: 'Schizophrenia', color: DISORDER_COLORS.schizophrenia },
        { key: 'bipolar', label: 'Bipolar', color: DISORDER_COLORS.bipolar },
        { key: 'eating', label: 'Eating', color: DISORDER_COLORS.eating },
    ];

    return (
        <div className={styles.container}>
            {/* Hero Header */}
            <header className={styles.heroHeader}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.pulseBadge}
                >
                    LIVE DATA · 190+ COUNTRIES
                </motion.div>
                <h1 className={styles.heroTitle}>The Global Pulse</h1>
                <p className={styles.heroSubtitle}>
                    Real data from a 30-year global health study. Visualize the impact. Feel the urgency. Change the narrative.
                </p>
            </header>

            {/* Impact Banner */}
            <div className={styles.impactBaner} ref={bannerRef}>
                <div className={styles.bannerItem}>
                    <h3 data-count-target="970" data-count-prefix="~" data-count-suffix="M" data-count-decimals="0">0</h3>
                    <p>People affected globally</p>
                </div>
                <div className={styles.bannerDivider} />
                <div className={styles.bannerItem}>
                    <h3>1 in 8</h3>
                    <p>People live with a mental disorder</p>
                </div>
                <div className={styles.bannerDivider} />
                <div className={styles.bannerItem}>
                    <h3 data-count-target="30" data-count-suffix=" Years" data-count-decimals="0">0</h3>
                    <p>Of tracked global data (1990–2019)</p>
                </div>
            </div>

            {/* === SECTION 1: Prevalence Trends === */}
            <SectionDivider
                icon={TrendingUp}
                title="Global Prevalence Trends (1990–2019)"
                subtitle="How mental illness prevalence has evolved over three decades, averaged across 190+ countries"
            />

            <div className={styles.tabContainer}>
                {disorderTabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.tabButton} ${activePrevalenceDisorder === tab.key ? styles.tabActive : ''}`}
                        style={tab.color ? { '--tab-color': tab.color } : {}}
                        onClick={() => setActivePrevalenceDisorder(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <motion.div
                className={`${styles.chartCard} ${styles.fullWidth}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={globalPrevalenceTrend}>
                            <defs>
                                {Object.entries(DISORDER_COLORS).map(([key, color]) => (
                                    <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {(activePrevalenceDisorder === 'all' || activePrevalenceDisorder === 'depression') && (
                                <Area type="monotone" dataKey="depression" name="Depression" stroke={DISORDER_COLORS.depression} strokeWidth={2} fill={`url(#grad-depression)`} />
                            )}
                            {(activePrevalenceDisorder === 'all' || activePrevalenceDisorder === 'anxiety') && (
                                <Area type="monotone" dataKey="anxiety" name="Anxiety" stroke={DISORDER_COLORS.anxiety} strokeWidth={2} fill={`url(#grad-anxiety)`} />
                            )}
                            {(activePrevalenceDisorder === 'all' || activePrevalenceDisorder === 'bipolar') && (
                                <Area type="monotone" dataKey="bipolar" name="Bipolar" stroke={DISORDER_COLORS.bipolar} strokeWidth={2} fill={`url(#grad-bipolar)`} />
                            )}
                            {(activePrevalenceDisorder === 'all' || activePrevalenceDisorder === 'schizophrenia') && (
                                <Area type="monotone" dataKey="schizophrenia" name="Schizophrenia" stroke={DISORDER_COLORS.schizophrenia} strokeWidth={2} fill={`url(#grad-schizophrenia)`} />
                            )}
                            {(activePrevalenceDisorder === 'all' || activePrevalenceDisorder === 'eating') && (
                                <Area type="monotone" dataKey="eating" name="Eating Disorders" stroke={DISORDER_COLORS.eating} strokeWidth={2} fill={`url(#grad-eating)`} />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* === SECTION 2: Disease Burden (DALYs) === */}
            <SectionDivider
                icon={Activity}
                title="Disease Burden Over Time (DALYs)"
                subtitle="Disability-Adjusted Life Years lost per 100,000 people — measuring the true cost of mental illness"
            />

            <div className={styles.tabContainer}>
                {disorderTabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.tabButton} ${activeBurdenDisorder === tab.key ? styles.tabActive : ''}`}
                        style={tab.color ? { '--tab-color': tab.color } : {}}
                        onClick={() => setActiveBurdenDisorder(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <motion.div
                className={`${styles.chartCard} ${styles.fullWidth}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={globalBurdenTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip content={<DALYsTooltip />} />
                            <Legend />
                            {(activeBurdenDisorder === 'all' || activeBurdenDisorder === 'depression') && (
                                <Line type="monotone" dataKey="depression" name="Depression" stroke={DISORDER_COLORS.depression} strokeWidth={3} dot={false} />
                            )}
                            {(activeBurdenDisorder === 'all' || activeBurdenDisorder === 'anxiety') && (
                                <Line type="monotone" dataKey="anxiety" name="Anxiety" stroke={DISORDER_COLORS.anxiety} strokeWidth={3} dot={false} />
                            )}
                            {(activeBurdenDisorder === 'all' || activeBurdenDisorder === 'bipolar') && (
                                <Line type="monotone" dataKey="bipolar" name="Bipolar" stroke={DISORDER_COLORS.bipolar} strokeWidth={3} dot={false} />
                            )}
                            {(activeBurdenDisorder === 'all' || activeBurdenDisorder === 'schizophrenia') && (
                                <Line type="monotone" dataKey="schizophrenia" name="Schizophrenia" stroke={DISORDER_COLORS.schizophrenia} strokeWidth={3} dot={false} />
                            )}
                            {(activeBurdenDisorder === 'all' || activeBurdenDisorder === 'eating') && (
                                <Line type="monotone" dataKey="eating" name="Eating Disorders" stroke={DISORDER_COLORS.eating} strokeWidth={3} dot={false} />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* === SECTION 3: Top Countries === */}
            <SectionDivider
                icon={Globe}
                title="Most Affected Countries (2019)"
                subtitle="Countries with the highest rates of depression and anxiety disorders"
            />

            <div className={styles.grid}>
                <motion.div
                    className={styles.chartCard}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.chartTitle}>
                        <Activity size={20} color={DISORDER_COLORS.depression} />
                        Top 10: Depression Prevalence
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={topCountriesDepression2019} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                                <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                                <YAxis type="category" dataKey="country" axisLine={false} tickLine={false} width={130} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={v => `${v.toFixed(2)}%`} />
                                <Bar dataKey="rate" fill={DISORDER_COLORS.depression} radius={[0, 8, 8, 0]} name="Prevalence" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.chartCard}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.chartTitle}>
                        <AlertCircle size={20} color={DISORDER_COLORS.anxiety} />
                        Top 10: Anxiety Prevalence
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={topCountriesAnxiety2019} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                                <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                                <YAxis type="category" dataKey="country" axisLine={false} tickLine={false} width={130} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={v => `${v.toFixed(2)}%`} />
                                <Bar dataKey="rate" fill={DISORDER_COLORS.anxiety} radius={[0, 8, 8, 0]} name="Prevalence" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* === SECTION 4: Treatment Gap === */}
            <SectionDivider
                icon={AlertCircle}
                title="The Treatment Gap"
                subtitle="Percentage of anxiety disorder cases that remain untreated across different countries"
            />

            <motion.div
                className={`${styles.chartCard} ${styles.fullWidth}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={420}>
                        <BarChart data={treatmentGapSorted} layout="vertical" margin={{ left: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                            <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                            <YAxis type="category" dataKey="country" axisLine={false} tickLine={false} width={160} tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={v => `${v}%`} />
                            <Legend />
                            <Bar dataKey="untreated" stackId="a" fill="#E12D39" name="Untreated" />
                            <Bar dataKey="other" stackId="a" fill="#F59E0B" name="Other Treatment" />
                            <Bar dataKey="adequate" stackId="a" fill="#3EBD93" name="Adequate Treatment" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* === SECTION 5: US Depressive Symptoms === */}
            <SectionDivider
                icon={Brain}
                title="Depressive Symptoms in the US"
                subtitle="How frequently different depressive symptoms are experienced across the US population"
            />

            <motion.div
                className={`${styles.chartCard} ${styles.fullWidth}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={380}>
                        <BarChart data={symptomsWithAffected} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                            <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                            <YAxis type="category" dataKey="symptom" axisLine={false} tickLine={false} width={160} tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={v => `${v}%`} />
                            <Legend />
                            <Bar dataKey="nearlyEveryDay" stackId="a" fill="#E12D39" name="Nearly Every Day" />
                            <Bar dataKey="moreThanHalf" stackId="a" fill="#F59E0B" name="More Than Half" />
                            <Bar dataKey="severalDays" stackId="a" fill="#6366F1" name="Several Days" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* === SECTION 6: Research Coverage === */}
            <SectionDivider
                icon={Eye}
                title="Research Coverage Gaps"
                subtitle="Percentage of adult population covered by depression prevalence studies, by world region"
            />

            <div className={styles.grid}>
                <motion.div
                    className={styles.chartCard}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.chartTitle}>
                        <BarChart3 size={20} color="var(--color-accent)" />
                        Depression Research Coverage by Region
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={researchCoverageSorted} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                                <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                                <YAxis type="category" dataKey="region" axisLine={false} tickLine={false} width={180} tick={{ fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={v => `${v}%`} />
                                <Bar dataKey="coverage" fill="var(--color-accent)" radius={[0, 8, 8, 0]} name="Coverage %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.chartCard}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.chartTitle}>
                        <Globe size={20} color="var(--color-success)" />
                        Countries with Primary Data by Disorder
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={countriesDataSorted} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="disorder" axisLine={false} tickLine={false} width={200} tick={{ fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Bar dataKey="countries" fill="var(--color-success)" radius={[0, 8, 8, 0]} name="Countries" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* CTA Card */}
            <motion.div
                className={`${styles.chartCard} ${styles.ctaCard}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                <Heart size={48} color="white" />
                <h3>Be the Solution</h3>
                <p>
                    Behind every statistic is a human story. MindEase is bridging the gap between
                    data awareness and mental resilience — turning numbers into action, and awareness
                    into well-being.
                </p>
            </motion.div>
        </div>
    );
};

export default GlobalStatistics;
